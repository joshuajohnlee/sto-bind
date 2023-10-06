import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const commands = require('./data/commands.json');

var commandList = []

Object.keys(commands).forEach(function (command) {
    commandList.push(command);
})

// Load and process data for keyboard/mouse/controller keys
const keypresses = require('./data/keys.json');
var keyList = []
Object.keys(keypresses).forEach(function (keytype) {
    Object.keys(keypresses[keytype]).forEach(function (key) {
        keyList.push(key);
    });
})

export default function Editor() {

    // Warning before trying to leave page
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }

    //                //
    // STATE CREATION //
    //                //

    const [keySettings, setKeySettings] = useState({
        "ctrl": "noctrl",
        "shift": "noshift",
        "alt": "noalt",
        "keypress": ""
    });

    const [commandSettings, setCommandSettings] = useState({
        "commandname": "Fire all weapons",
        "traynumber": null,
        "slotnumber": null,
        "startslotnumber": null,
        "endslotnumber": null,
        "powername": null,
        "throttleadjust": null
    })

    const [bindName, setBindName] = useState("");
    const [charOrKey, setCharOrKey] = useState("char")
    const [finalString, setFinalString] = useState([])
    const [bindMode, setBindMode] = useState("console");

    // Get saved commands from local storage or create empty array

    const [confirmedCommands, setConfirmedCommands] = useState(() => {
        const savedCommands = window.localStorage.getItem("confirmedCommands");
        return savedCommands !== null ? JSON.parse(savedCommands) : [];
    })
    // Update local storage commands when state changes
    useEffect(() => { localStorage.setItem("savedCommands", JSON.stringify(confirmedCommands)) }, [confirmedCommands])

    // Get saved keybinds from local storage or create empty array

    const [savedKeybinds, setSavedKeybinds] = useState(() => {
        const savedBinds = window.localStorage.getItem("savedKeybinds");
        return savedBinds !== null ? JSON.parse(savedBinds) : [];
    })

    // Update local storage keybinds when state changes
    useEffect(() => { localStorage.setItem("savedKeybinds", JSON.stringify(savedKeybinds)) }, [savedKeybinds])

    // List of special command names that need handled differently

    const specialCommands = ["Execute a full tray", "Execute a partial tray", "Execute a power by name", "Execute a single tray command"]

    //                     //
    //  HANDLER FUNCTIONS  //
    //                     //

    function setDefaults() {
        const DEFAULT_KEY_SETTINGS = {
            "ctrl": "noctrl",
            "shift": "noshift",
            "alt": "noalt",
            "keypress": ""
        }
        setKeySettings(DEFAULT_KEY_SETTINGS)
        const DEFAULT_CMD_SETTINGS = {
            "commandname": "Fire all weapons",
            "traynumber": 1,
            "slotnumber": 1,
            "startslotnumber": 1,
            "endslotnumber": 1,
            "powername": "",
            "throttleadjust": ""
        }
        setCommandSettings(DEFAULT_CMD_SETTINGS);
        setConfirmedCommands([])
        setBindName("");
        setCharOrKey("char")
    }

    // Special cases for certain commands that require special data to work, otherwise add the command.
    function handleAddCommand(e) {
        e.preventDefault();

        let alreadyexists = false
        Object.keys(confirmedCommands).forEach(function (key) {
            if (confirmedCommands[key]["command"] === commandSettings.commandname && !specialCommands.includes(confirmedCommands[key]["commandname"])) {
                alert("You've already selected this command!");
                alreadyexists = true;
            }
        });
        if (alreadyexists) {
            return
        } else {
            let newcommands = [...confirmedCommands, commandSettings]
            setConfirmedCommands(newcommands)
        }
    }

    function handleRemoveCommand(e) {
        e.preventDefault();

        // Keep all commands EXCEPT where the command is "Execute a full tray" and has the same tray number.
        if (e.target.value === "Execute a full tray") {
            let newCommandArray = confirmedCommands.filter(
                savedcommand =>
                    savedcommand.commandname !== e.target.value || (savedcommand.commandname === e.target.value &&
                        savedcommand.traynumber !== e.target.getAttribute("data-traynumber"))
            );
            setConfirmedCommands(newCommandArray);
        }
        // Keep all commands EXCEPT where the command is "Execute a partial tray" and has the same tray number and slot start/end numbers.
        else if (e.target.value === "Execute a partial tray") {
            let newCommandArray = confirmedCommands.filter(
                savedcommand =>
                    savedcommand.command !== e.target.value ||
                    (
                        savedcommand.command === e.target.value &&
                        (
                            savedcommand.startslotnumber !== e.target.getAttribute("data-startslotnumber") ||
                            savedcommand.endslotnumber !== e.target.getAttribute("data-endslotnumber") ||
                            savedcommand.traynumber !== e.target.getAttribute("data-traynumber")
                        )
                    )
            );
            setConfirmedCommands(newCommandArray);
        }
        // Keep all commands EXCEPT where the command is "Execute a power by name" and has the same power name.
        else if (e.target.value === "Execute a power by name") {
            let newCommandArray = confirmedCommands.filter(
                savedcommand =>
                    savedcommand.command !== e.target.value || (savedcommand.command === e.target.value &&
                        savedcommand.powername !== e.target.getAttribute("data-powername"))
            );
            setConfirmedCommands(newCommandArray);
        }
        // Keep all commands EXCEPT where the command is "Execute a single tray" and has the same tray number and the same slot number.
        else if (e.target.value === "Execute a single tray command") {
            let newCommandArray = confirmedCommands.filter(
                savedcommand =>
                    savedcommand.command !== e.target.value ||
                    (
                        savedcommand.command === e.target.value &&
                        (
                            savedcommand.traynumber !== e.target.getAttribute("data-traynumber") || (
                                savedcommand.traynumber === e.target.getAttribute("data-traynumber") &&
                                savedcommand.slotnumber !== e.target.getAttribute("data-slotnumber")
                            )
                        )
                    )
            );
            setConfirmedCommands(newCommandArray);
        }
        // If none of the above apply, remove command based on the command name alone.
        else {
            let newCommandArray = confirmedCommands.filter(savedcommand => savedcommand.commandname !== e.target.value)
            setConfirmedCommands(newCommandArray)
        }
    }

    function handleCharOrKey(changeTo) {
        if (changeTo === "key") {
            setKeySettings({ ...keySettings, "keypress": "Space bar" })
            setCharOrKey("key")
        } else if (changeTo === "char") {
            setKeySettings({ ...keySettings, "keypress": "" })
            setCharOrKey("char")
        }
    }

    // Create bind string functions

    function handleCopyString(e) {
        e.preventDefault()
        console.log("Trying to print the final string:")
        console.log(finalString)
        navigator.clipboard.writeText(finalString)
        toast.success('Copied!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    function changeBindMode(mode) {
        setBindMode(mode);
        buildBindStrings(bindMode);
    }

    function handleSaveKeybind(e) {
        e.preventDefault();

        if (bindName === "") { // Check keybind name not empty
            alert("You haven't given your keybind a name!");
            return;
        } else if (confirmedCommands.length === 0) { // Check there are actually commands for the keybind
            alert("There are no commands to save!")
            return;
        } else if (keySettings.keypress === "") { // Check there was a key given to bind to
            alert("No key was selected!")
            return;
        } else {
            let keybindToSave = {
                "bindname": bindName,
                "commands": confirmedCommands,
                "keysettings": keySettings
            }
            console.log(keybindToSave["commands"])
            let newKeyBinds = [...savedKeybinds, keybindToSave] //Create a new array because React wont rerender based on a direct update
            setSavedKeybinds(newKeyBinds);
            toast("Bind was saved as " + bindName);
            setDefaults(); // Reset the form to default values for next keybind
        }
    }

    // Each delete keybind button has the bind name as the value
    // Filter existing keybinds to remove those matching the keybind name 
    function handleDeleteSavedKeybind(e) {
        e.preventDefault()
        let bindsSurvivingDelete = savedKeybinds.filter(x => x.bindname !== e.target.value)
        setSavedKeybinds(bindsSurvivingDelete);
    }

    function buildBindStrings(buildMode) {

        let fullKeybindString = "";

        savedKeybinds.forEach((keybind) => {
            let commandIterator = 0;
            let singleKeybindString = "";

            if (buildMode === "console") {
                singleKeybindString += "/bind ";
            }

            switch (keybind["keysettings"]["ctrl"]) {
                case "noctrl":
                    break;
                case "leftctrl":
                    singleKeybindString += "LCTRL+"
                    break;
                case "rightctrl":
                    singleKeybindString += "RCTRL+"
                    break;
                case "anyctrl":
                    singleKeybindString += "Control+"
                    break;
                default:
                    break;
            }

            switch (keybind.keysettings.ctrl) {
                case "noshift":
                    break;
                case "leftshift":
                    singleKeybindString += "LShift+"
                    break;
                case "rightctrl":
                    singleKeybindString += "RShift+"
                    break;
                case "anyctrl":
                    singleKeybindString += "Shift+"
                    break;
                default:
                    break;
            }

            switch (keybind.keysettings.alt) {
                case "noalt":
                    break;
                case "leftalt":
                    singleKeybindString += "LAlt+"
                    break;
                case "rightalt":
                    singleKeybindString += "RAlt+"
                    break;
                case "anyalt":
                    singleKeybindString += "Alt+"
                    break;
                default:
                    break;
            }

            if (typeof keypresses[keybind.keysettings.keypress] !== "undefined") {
                singleKeybindString += keypresses[keybind.keysettings.keypress];
            } else {
                singleKeybindString += keybind.keysettings.keypress
            }

            singleKeybindString += " "

            if (buildMode === "file") {
                singleKeybindString += "\""
            }

            console.log("Should be about to iterate:")
            console.log(confirmedCommands)

            keybind.commands.forEach((command) => {
                let thisCommandName = command["commandname"];
                console.log("Trying to switch cmd name " + thisCommandName);

                switch (thisCommandName) {
                    case "Execute a single tray command":
                        if (commandIterator > 0) {
                            singleKeybindString += " $$ "
                        }
                        singleKeybindString += (command["commandname"] + " " + command.traynumber + " " + command.slotnumber + " ");
                        commandIterator++;
                        break;
                    case "Execute a power by name":
                        if (commandIterator > 0) {
                            singleKeybindString += " $$ "
                        }
                        singleKeybindString += (commands[command["commandname"]] + " " + command.powername + " ");
                        commandIterator++;
                        break;
                    case "Execute a partial tray":
                        for (let i = command.startslotnumber - 1; i < command.endslotnumber; i++) {
                            if (commandIterator > 0) {
                                singleKeybindString += " $$ "
                            }
                            singleKeybindString += ("+TrayExecByTray " + command.traynumber + " " + i + " ");
                            commandIterator++;
                        }
                        break;
                    case "Execute a full tray":
                        for (let i = 0; i <= 10; i++) {
                            if (commandIterator > 0) {
                                singleKeybindString += " $$ "
                            }
                            singleKeybindString += ("+TrayExecByTray " + command.traynumber + " " + i + " ");
                            commandIterator++;
                        }
                        break;
                    case "Adjust throttle by percentage":
                        if (commandIterator > 0) {
                            singleKeybindString += " $$ "
                        }
                        singleKeybindString += ("throttleadjust " + command.throttleadjust / 100 + " ");
                        commandIterator++;
                        break;
                    default:
                        if (commandIterator > 0) {
                            singleKeybindString += " $$ "
                        }
                        singleKeybindString += commands[command["commandname"]];
                        commandIterator++;
                }
            })


            if (buildMode === "file") {
                singleKeybindString += "\"";
            }

            singleKeybindString += "\n";
            fullKeybindString += singleKeybindString;
        })

        setFinalString(fullKeybindString)
    }

    // Bad use effect
    // eslint-disable-next-line
    useEffect(() => buildBindStrings(bindMode), [savedKeybinds]);

    function  downloadTxtFile(e) {
        e.preventDefault();
        const element = document.createElement("a");
        let exportstring = finalString
        const file = new Blob([exportstring], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "keybindexport.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      }

    // Return the page
    return (
        <>
            <div id="editorcontainer">
                <form className="editorform">

                    <h1>Build your keybind</h1>

                    <section id="keysetter" className="formpart">
                        <h2 className="sectiontitle"> Step one: select the key combination to use</h2>
                        <div id="ctrlblock">
                            <label htmlFor='ctrlsetting'>CTRL Key:</label>
                            <fieldset name="ctrlsetting">
                                <input type="radio" value="noctrl" name="ctrlsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "ctrl": e.target.value })} checked={keySettings.ctrl === "noctrl"} /> No control key<br />
                                <input type="radio" value="anyctrl" name="ctrlsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "ctrl": e.target.value })} checked={keySettings.ctrl === "anyctrl"} /> Either control key<br />
                                <input type="radio" value="leftctrl" name="ctrlsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "ctrl": e.target.value })} checked={keySettings.ctrl === "leftctrl"} /> Left control key<br />
                                <input type="radio" value="rightctrl" name="ctrlsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "ctrl": e.target.value })} checked={keySettings.ctrl === "rightctrl"} /> Right control key
                            </fieldset>
                        </div>

                        <div id="shiftblock">
                            <label htmlFor='shiftsetting'>Shift Key:</label>
                            <fieldset name="shiftsetting">
                                <input type="radio" value="noshift" name="shiftsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "shift": e.target.value })} checked={keySettings.shift === "noshift"} /> No shift key<br />
                                <input type="radio" value="anyshift" name="shiftsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "shift": e.target.value })} checked={keySettings.shift === "anyshift"} />  Either shift key<br />
                                <input type="radio" value="leftshift" name="shiftsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "shift": e.target.value })} checked={keySettings.shift === "leftshift"} /> Left shift key<br />
                                <input type="radio" value="rightshift" name="shiftsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "shift": e.target.value })} checked={keySettings.shift === "rightshift"} /> Right shift key
                            </fieldset>
                        </div>

                        <div id="altblock">
                            <label htmlFor='altsetting'>Alt Key:</label>
                            <fieldset name="altsetting">
                                <input type="radio" value="noalt" name="altsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "alt": e.target.value })} checked={keySettings.alt === "noalt"} /> No alt key<br />
                                <input type="radio" value="anyalt" name="altsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "alt": e.target.value })} checked={keySettings.alt === "anyalt"} /> Either alt key<br />
                                <input type="radio" value="leftalt" name="altsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "alt": e.target.value })} checked={keySettings.alt === "left"} /> Left alt key<br />
                                <input type="radio" value="rightalt" name="altsettinggroup" onChange={(e) => setKeySettings({ ...keySettings, "alt": e.target.value })} checked={keySettings.alt === "right"} /> Right alt key
                            </fieldset>
                        </div>

                        <div id="keyblock">

                            <div id="charorkey-char"><input type="radio" value="char" name="charorkey" onChange={() => handleCharOrKey("char")} defaultChecked={true} />Use a character or numbers</div>
                            <div id="charorkey-key"><input type="radio" value="key" name="charorkey" onChange={() => handleCharOrKey("key")} />Use a special key</div>


                            {charOrKey === "char" && <>
                                <label htmlFor='keyselector'>Enter a number or letter (lowercase or uppercase): </label>
                                <input value={keySettings.keypress} type="text" name="keyselector" maxLength="1" onChange={(e) => setKeySettings({ ...keySettings, "keypress": e.target.value })} />
                            </>}


                            {charOrKey === "key" && <>
                                <label htmlFor='keyselector'>Choose a key or button:</label>
                                <select name="keyselector" onChange={(e) => setKeySettings({ ...keySettings, "keypress": e.target.value })} >
                                    {keyList.map(x => <option value={x} key={x}>{x}</option>)}
                                </select>
                            </>}
                        </div>

                        <div id="keyconfirmation">
                            Your key combination will be <strong>
                                {keySettings.ctrl === "anyctrl" && <>Ctrl + </>} {keySettings.ctrl === "leftctrl" && <>Left Ctrl + </>} {keySettings.ctrl === "rightctrl" && <>Right Ctrl + </>} {keySettings.shift === "anyshift" && <>Shift + </>} {keySettings.shift === "leftshift" && <>Left Shift + </>} {keySettings.shift === "rightshift" && <>Right Shift + </>} {keySettings.alt === "anyalt" && <>Alt + </>} {keySettings.alt === "leftalt" && <>Left Alt + </>} {keySettings.alt === "rightalt" && <>Right Alt + </>} {keySettings.keypress}</strong>
                        </div>
                    </section>

                    <section id="commandsetter" className="formpart">
                        <h2 className="sectiontitle">Step Two: Set the commands to run</h2>
                        <label htmlFor="commandselector">Choose a command:</label>
                        <select name="commandselector" value={commandSettings.commandname} onChange={(e) => setCommandSettings({ ...commandSettings, "commandname": e.target.value })}>
                            {commandList.map(x => <option value={x} key={x}>{x}</option>)}
                        </select>

                        {commandSettings.commandname === "Execute a single tray command" &&
                            <>
                                <div className="advanced-options">
                                    Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "traynumber": e.target.value })}></input>
                                    Slot number: <input type="number" name="slotnumber" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "slotnumber": e.target.value })}></input>
                                </div>
                            </>
                        }

                        {commandSettings.commandname === "Execute a full tray" &&
                            <>
                                <div className="advanced-options">
                                    Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "traynumber": e.target.value })}></input>
                                </div>
                            </>
                        }

                        {commandSettings.commandname === "Execute a partial tray" &&
                            <>
                                <div className="advanced-options">
                                    Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "traynumber": e.target.value })}></input>
                                    Starting slot number: <input type="number" name="startslotnumber" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "startslotnumber": (e.target.value) })}></input>
                                    Ending slot number: <input type="number" name="endslotnumber" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "endslotnumber": e.target.value })}></input>
                                </div>
                            </>
                        }

                        {commandSettings.commandname === "Execute a power by name" &&
                            <>
                                <div className="advanced-options">
                                    Power name: <input type="text" name="powername" min="1" max="10" onChange={(e) => setCommandSettings({ ...commandSettings, "powername": e.target.value })}></input>
                                </div>
                                <div className="inline-warning">Make sure you enter the power name exactly as it appears in game (including punctuation and symbols) or this will not work.</div>
                            </>
                        }

                        {commandSettings.commandname === "Adjust throttle by percentage" &&
                            <>
                                Throttle change percentage: <input type="number" name="throttlechange" min="-100" max="100" onChange={(e) => setCommandSettings({ ...commandSettings, "throttleadjust": (e.target.value) })}></input>
                                <div className="inline-warning">Use -100 for reverse throttle by 100%, and 100 for increase throttle by 100%.</div>
                            </>
                        }

                        <button onClick={handleAddCommand}>Add this command to the keybind</button>
                        <br />
                        <div id="currentcommandslist">
                            <h4>Commands to be added to this keybind:</h4>
                            {confirmedCommands.map((item) =>
                                <>
                                    <span className="commanddetails">
                                        {item.commandname}
                                        {item.commandname === "Execute a partial tray" && <> - Tray {item.traynumber}, slots {item.startslotnumber} to {item.endslotnumber} </>}
                                        {item.commandname === "Execute a full tray" && <> - Tray {item.traynumber}</>}
                                        {item.commandname === "Execute a single tray command" && <> - Tray {item.traynumber}, slot {item.slotnumber}</>}
                                        {item.commandname === "Execute a power by name" && <> - Power name: {item.powername}</>}
                                        {item.commandname === "Adjust throttle by percentage" && <> - Throttle Percentage change {item.throttleadjust}%</>}
                                    </span>
                                    <button className="removeitembutton" key={item.commandname} data-traynumber={item.traynumber} data-startslotnumber={item.startslotnumber} data-endslotnumber={item.endslotnumber} data-powername={item.powername} data-slotnumber={item.slotnumber} value={item.commandname} onClick={handleRemoveCommand}>Remove</button><br />
                                </>)
                            }
                        </div>

                    </section>

                    <section id="keybindsummary" className="formpart">

                        <h2 className="sectiontitle">Name and save your keybind</h2>

                        Keybind name: <input type="text" onChange={(e) => setBindName(e.target.value)} value={bindName}></input><br /><br />
                        <button onClick={handleSaveKeybind}>Save this keybind</button>

                        <h3>Your saved keybinds</h3>

                        <table id="savedcommandtable">
                            <tr>
                                <th>Keybind Name</th>
                                <th>Keypress</th>
                                <th></th>
                            </tr>

                            {savedKeybinds.map((item) =>
                                <>
                                    <tr>
                                        <td>{item.bindname}</td>
                                        <td>{item.keysettings.ctrl === "anyctrl" && <>Ctrl + </>} {item.keysettings.ctrl === "leftctrl" && <>Left Ctrl + </>} {item.keysettings.ctrl === "rightctrl" && <>Right Ctrl + </>} {item.keysettings.shift === "anyshift" && <>Shift + </>} {item.keysettings.shift === "leftshift" && <>Left Shift + </>} {item.keysettings.shift === "rightshift" && <>Right Shift + </>} {item.keysettings.alt === "anyalt" && <>Alt + </>} {item.keysettings.alt === "leftalt" && <>Left Alt + </>} {item.keysettings.alt === "rightalt" && <>Right Alt + </>} {item.keysettings.keypress}</td>
                                        <td><button className="removeitembutton" value={item.bindname} key={item.bindname} onClick={handleDeleteSavedKeybind}>Remove</button><br /></td>
                                    </tr>
                                </>)
                            }
                        </table>
                    </section>

                    <section id="exportsection" className="formpart">

                        <h2>Export your keybinds</h2>

                        {bindMode === "console" && <><div className="advice-box">To use bind commands in the console (the game's chat box), copy and individual command that starts with "/bind", paste it into your chat and press enter. The bind will automatically save and become part of that character's keybinds.</div></>}
                        <div name="bindmodesetter" id="bindmodesetter">
                            <input type="radio" value="console" name="bindmodesetter" onChange={() => changeBindMode("console")} checked={bindMode === "console"} /> Chat box command mode<br />
                            <input type="radio" value="file" name="bindmodesetter" onChange={() => changeBindMode("file")} checked={bindMode === "file"}/> Bind file mode
                        </div>

                        <div id="finalstring">
                            {(finalString.length === 0 && <>Nothing to export!</>) || finalString}
                        </div>

                        <button onClick={handleCopyString}>Copy Bind String</button>
                        {bindMode === "file" && finalString.length !== 0 && <><button onClick={downloadTxtFile}>Download txt</button></>}
                    </section>
                </form>
            </div>

            <ToastContainer />
        </>
    )
}