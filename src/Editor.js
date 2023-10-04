import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let commands = require('./data/commands.json');

var commandList = []

Object.keys(commands).forEach(function (command) {
    commandList.push(command);
})

// Load and process data for keyboard/mouse/controller keys
let keys = require('./data/keys.json');
var keyList = []
Object.keys(keys).forEach(function (keytype) {
    Object.keys(keys[keytype]).forEach(function (key) {
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

    const [currentSelectedCommand, setCurrentSelectedCommand] = useState("Execute a power by name");
    const [confirmedCommands, setConfirmedCommands] = useState([]);
    const [bindName, setBindName] = useState("");
    const [ctrlSetting, setCtrlSetting] = useState("fornoctrl");
    const [shiftSetting, setShiftSetting] = useState("fornoshift");
    const [altSetting, setAltSetting] = useState("fornoalt");
    const [keySetting, setKeySetting] = useState("");
    const [trayNumber, setTrayNumber] = useState(1)
    const [slotNumber, setSlotNumber] = useState(1)
    const [startSlotNumber, setStartSlotNumber] = useState(1)
    const [endSlotNumber, setEndSlotNumber] = useState(1)
    const [powerName, setPowerName] = useState("")
    const [throttleAdjust, setThrottleAdjust] = useState(0)
    const [charOrKey, setCharOrKey] = useState("char")
    const [savedKeybinds, setSavedKeybinds] = useState([])
    const [finalString, setFinalString] = useState([])

    //                     //
    //  HANDLER FUNCTIONS  //
    //                     //

    function setDefaults() {
        setCurrentSelectedCommand("Execute a power by name");
        setConfirmedCommands([]);
        setBindName("");
        setCtrlSetting("fornoctrl");
        setShiftSetting("fornoshift");
        setAltSetting("fornoalt");
        setKeySetting("Space bar");
        setTrayNumber(1);
        setSlotNumber(1);
        setStartSlotNumber(1);
        setEndSlotNumber(1);
        setPowerName("");
        setThrottleAdjust(0);
        setCharOrKey("char")
    }

    // Special cases for certain commands that require special data to work, otherwise add the command.
    function handleAddCommand(e) {
        e.preventDefault();

        if (currentSelectedCommand === "Execute a single tray command") {
            setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand, "traynumber": trayNumber, "slotnumber": slotNumber }])
            return;
        } else if (currentSelectedCommand === "Execute a power by name") {
            setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand, "powername": powerName }])
            return;
        } else if (currentSelectedCommand === "Execute a partial tray") {
            setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand, "traynumber": trayNumber, "startslotnumber": startSlotNumber, "endslotnumber": endSlotNumber }])
            return;
        } else if (currentSelectedCommand === "Execute a full tray") {
            setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand, "traynumber": trayNumber }])
            return;
        } else if (currentSelectedCommand === "Adjust throttle by percentage") {
            setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand, "throttleadjust": throttleAdjust }])
            return;
        }
        else {
            let alreadyexists = false
            Object.keys(confirmedCommands).forEach(function (key) {
                if (confirmedCommands[key]["command"] === currentSelectedCommand) {
                    alert("You've already selected this command!");
                    alreadyexists = true;
                }
            });
            if (alreadyexists) {
                return
            } else {
                console.log(currentSelectedCommand);
                setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand }])
            }
        }

    }

    function handleRemoveCommand(e) {
        e.preventDefault();

        // Keep all commands EXCEPT where the command is "Execute a full tray" and has the same tray number.
        if (e.target.value === "Execute a full tray") {
            let newCommandArray = confirmedCommands.filter(
                savedcommand =>
                    savedcommand.command !== e.target.value || (savedcommand.command === e.target.value &&
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
            let newCommandArray = confirmedCommands.filter(savedcommand => savedcommand.command !== e.target.value)
            setConfirmedCommands(newCommandArray)
        }
    }

    function handleCharOrKey(changeTo) {
        if (changeTo === "key") {
            setKeySetting("Space bar")
            setCharOrKey("key")
        } else if (changeTo === "char") {
            setKeySetting("")
            setCharOrKey("char")
        }
    }

    // Create bind string functions

    function handleCopyString(e) {
        e.preventDefault()
        console.log("Trying to print the final string:")
        console.log(finalString)
        navigator.clipboard.writeText(finalString)
        toast.success('Copied! (Except it doesn\'t do anything yet so you just copied a test.)', {
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

    function buildABind() {

        let fullbindtoreturn = ""

        for (const savedBindIndex in savedKeybinds) {

            let thiscommandbind = "/bind "

            switch (savedKeybinds[savedBindIndex].ctrlsetting) {
                case "fornoctrl":
                    break;
                case "leftctrl":
                    thiscommandbind += "LCTRL+"
                    break;
                case "rightctrl":
                    thiscommandbind += "RCTRL+"
                    break;
                case "anyctrl":
                    thiscommandbind += "Control+"
                    break;
                default:
                    break;
            }

            switch (savedKeybinds[savedBindIndex].shiftsetting) {
                case "fornoshift":
                    break;
                case "leftshift":
                    thiscommandbind += "LShift+"
                    break;
                case "rightctrl":
                    thiscommandbind += "RShift+"
                    break;
                case "anyctrl":
                    thiscommandbind += "Shift+"
                    break;
                default:
                    break;
            }

            switch (savedKeybinds[savedBindIndex].altsetting) {
                case "fornoalt":
                    break;
                case "leftalt":
                    thiscommandbind += "LAlt+"
                    break;
                case "rightalt":
                    thiscommandbind += "RAlt+"
                    break;
                case "anyalt":
                    thiscommandbind += "Alt+"
                    break;
                default:
                    break;
            }

            console.log(keys[savedKeybinds[savedBindIndex].keysetting]);

            if (typeof keys[savedKeybinds[savedBindIndex].keysetting] !== "undefined") {
                thiscommandbind += keys[savedKeybinds[savedBindIndex].keysetting];
            } else {
                thiscommandbind += savedKeybinds[savedBindIndex].keysetting
            }

            thiscommandbind += " \""

            for (let savedCommandIndex in confirmedCommands) {
                if (confirmedCommands[savedCommandIndex].command === "Execute a single tray command") {
                    let builtstring = "" + commandList[confirmedCommands[savedCommandIndex].command] + confirmedCommands[savedCommandIndex].traynumber + confirmedCommands[savedCommandIndex].slotnumber
                    thiscommandbind += builtstring
                    break;
                } else if (confirmedCommands[savedCommandIndex].command === "Execute a power by name") {
                    let builtstring = commandList[confirmedCommands[savedCommandIndex].command] + confirmedCommands[savedCommandIndex].powername
                    thiscommandbind += builtstring;
                    break;
                } else if (confirmedCommands[savedCommandIndex].command === "Execute a partial tray") {
                    let builtstring = ""
                    for (let i = confirmedCommands[savedCommandIndex].startslotnumber - 1; i < confirmedCommands[savedCommandIndex].endslotnumber; i++) {
                        builtstring += "+TrayExecByTray "
                        builtstring += confirmedCommands[savedCommandIndex].traynumber + i;
                    }
                    thiscommandbind += builtstring
                    break;
                } else if (currentSelectedCommand === "Execute a full tray") {
                    let builtstring = ""
                    for (let i = 0; i <= confirmedCommands[savedCommandIndex].endslotnumber; i++) {
                        builtstring += "+TrayExecByTray "
                        builtstring += confirmedCommands[savedCommandIndex].traynumber + i;
                    }
                    thiscommandbind += builtstring
                    break;
                } else if (currentSelectedCommand === "Adjust throttle by percentage") {
                    let builtstring = "throttleadjust " + confirmedCommands[savedCommandIndex].throttleadjust / 100
                    thiscommandbind += builtstring
                    break;
                } else {
                    console.log("Trying to find the following as a key in the command list:")
                    console.log(confirmedCommands[savedCommandIndex].command)
                    console.log("Which returned:")
                    console.log(commands[confirmedCommands[savedCommandIndex].command])

                    thiscommandbind += commands[confirmedCommands[savedCommandIndex].command]
                }
            }

            thiscommandbind += "\"\n"
            fullbindtoreturn += thiscommandbind
        }

        setFinalString(fullbindtoreturn)
    }

    // Check bind name isn't empty, commands to add aren't empty, and that there is a key to bind
    function handleSaveKeybind(e) {
        e.preventDefault();

        if (bindName === "") {
            alert("You haven't given your keybind a name!");
            return;
        } else if (confirmedCommands.length === 0) {
            alert("There are no commands to save!")
            return;
        } else if (keySetting === "") {
            alert("No key was selected!")
            return;
        } else {
            let keybindToSave = {
                "bindname": bindName,
                "runcommands": confirmedCommands,
                "ctrlsetting": ctrlSetting,
                "shiftsetting": shiftSetting,
                "altsetting": altSetting,
                "keysetting": keySetting
            }
            setSavedKeybinds([...savedKeybinds, keybindToSave])
            toast("Bind was saved as " + bindName)
            buildABind();
            setDefaults();
        }


    }

    // Each delete keybind button has the bind name as the value
    // Filter existing keybinds to remove those matching the keybind name 
    function handleDeleteSavedKeybind(e) {
        e.preventDefault()
        let bindsurvivingdelete = savedKeybinds.filter(x => x.bindname !== e.target.value)
        setSavedKeybinds(bindsurvivingdelete)
        buildABind();
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
                                <input type="radio" value="noctrl" name="ctrlsettinggroup" onChange={(e) => setCtrlSetting(e.target.value)} defaultChecked={true} /> No control key<br />
                                <input type="radio" value="anyctrl" name="ctrlsettinggroup" onChange={(e) => setCtrlSetting(e.target.value)} /> Either control key<br />
                                <input type="radio" value="leftctrl" name="ctrlsettinggroup" onChange={(e) => setCtrlSetting(e.target.value)} /> Left control key<br />
                                <input type="radio" value="rightctrl" name="ctrlsettinggroup" onChange={(e) => setCtrlSetting(e.target.value)} /> Right control key
                            </fieldset>
                        </div>

                        <div id="shiftblock">
                            <label htmlFor='shiftsetting'>Shift Key:</label>
                            <fieldset name="shiftsetting">
                                <input type="radio" value="noshift" name="shiftsettinggroup" onChange={(e) => setShiftSetting(e.target.value)} defaultChecked={true} /> No shift key<br />
                                <input type="radio" value="anyshift" name="shiftsettinggroup" onChange={(e) => setShiftSetting(e.target.value)} />  Either shift key<br />
                                <input type="radio" value="leftshift" name="shiftsettinggroup" onChange={(e) => setShiftSetting(e.target.value)} /> Left shift key<br />
                                <input type="radio" value="rightshift" name="shiftsettinggroup" onChange={(e) => setShiftSetting(e.target.value)} /> Right shift key
                            </fieldset>
                        </div>

                        <div id="altblock">
                            <label htmlFor='altsetting'>Alt Key:</label>
                            <fieldset name="altsetting">
                                <input type="radio" value="noalt" name="altsettinggroup" onChange={(e) => setAltSetting(e.target.value)} defaultChecked={true} /> No alt key<br />
                                <input type="radio" value="anyalt" name="altsettinggroup" onChange={(e) => setAltSetting(e.target.value)} /> Either alt key<br />
                                <input type="radio" value="leftalt" name="altsettinggroup" onChange={(e) => setAltSetting(e.target.value)} /> Left alt key<br />
                                <input type="radio" value="rightalt" name="altsettinggroup" onChange={(e) => setAltSetting(e.target.value)} /> Right alt key
                            </fieldset>
                        </div>

                        <div id="keyblock">

                            <fieldset name="charorkey">
                                <input type="radio" value="char" name="charorkey" onChange={() => handleCharOrKey("char")} defaultChecked={true} />Use a character or numbers
                                <input type="radio" value="key" name="charorkey" onChange={() => handleCharOrKey("key")} />Use a special key
                            </fieldset>

                            {charOrKey === "char" && <>
                                <label htmlFor='keyselector'>Enter a number or letter (lowercase or uppercase): </label>
                                <input type="text" name="keyselector" maxLength="1" onChange={(e) => setKeySetting(e.target.value)} />
                            </>}


                            {charOrKey === "key" && <>
                                <label htmlFor='keyselector'>Choose a key or button:</label>
                                <select name="keyselector" onChange={(e) => setKeySetting(e.target.value)} >
                                    {keyList.map(x => <option value={x} key={x}>{x}</option>)}
                                </select>
                            </>}
                        </div>

                        <div id="keyconfirmation">
                            Your key combination will be<strong>
                                {ctrlSetting === "anyctrl" && <>Ctrl + </>} {ctrlSetting === "leftctrl" && <>Left Ctrl + </>} {ctrlSetting === "rightctrl" && <>Right Ctrl + </>} {shiftSetting === "anyshift" && <>Shift + </>} {shiftSetting === "leftshift" && <>Left Shift + </>} {shiftSetting === "rightshift" && <>Right Shift + </>} {altSetting === "anyalt" && <>Alt + </>} {altSetting === "leftalt" && <>Left Alt + </>} {altSetting === "rightalt" && <>Right Alt + </>} {keySetting}</strong>
                        </div>
                    </section>

                    <section id="commandsetter" className="formpart">
                        <h2 className="sectiontitle">Step Two: Set the commands to run</h2>
                        <label htmlFor="commandselector">Choose a command:</label>
                        <select name="commandselector" value={currentSelectedCommand} onChange={(e) => setCurrentSelectedCommand(e.target.value)}>
                            {commandList.map(x => <option value={x} key={x}>{x}</option>)}
                        </select>

                        {currentSelectedCommand === "Execute a single tray command" &&
                            <>
                                <div className="advanced-options">
                                    Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={(e) => setTrayNumber(e.target.value)}></input>
                                    Slot number: <input type="number" name="slotnumber" min="1" max="10" onChange={(e) => setSlotNumber(e.target.value)}></input>
                                </div>
                            </>
                        }

                        {currentSelectedCommand === "Execute a full tray" &&
                            <>
                                <div className="advanced-options">
                                    Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={(e) => setTrayNumber(e.target.value)}></input>
                                </div>
                            </>
                        }

                        {currentSelectedCommand === "Execute a partial tray" &&
                            <>
                                <div className="advanced-options">
                                    Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={(e) => setTrayNumber(e.target.value)}></input>
                                    Starting slot number: <input type="number" name="startslotnumber" min="1" max="10" onChange={(e) => setStartSlotNumber(e.target.value)}></input>
                                    Ending slot number: <input type="number" name="startslotnumber" min="1" max="10" onChange={(e) => setEndSlotNumber(e.target.value)}></input>
                                </div>
                            </>
                        }

                        {currentSelectedCommand === "Execute a power by name" &&
                            <>
                                <div className="advanced-options">
                                    Power name: <input type="text" name="powername" min="1" max="10" onChange={(e) => setPowerName(e.target.value)}></input>
                                </div>
                                <div className="inline-warning">Make sure you enter the power name exactly as it appears in game (including punctuation and symbols) or this will not work.</div>
                            </>
                        }

                        {currentSelectedCommand === "Adjust throttle by percentage" &&
                            <>
                                Throttle change percentage: <input type="number" name="throttlechange" min="-100" max="100" onChange={(e) => setThrottleAdjust(e.target.value)}></input>
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
                                        {item.command}
                                        {item.command === "Execute a partial tray" && <> - Tray {item.traynumber}, slots {item.startslotnumber} to {item.endslotnumber} </>}
                                        {item.command === "Execute a full tray" && <> - Tray {item.traynumber}</>}
                                        {item.command === "Execute a single tray command" && <> - Tray {item.traynumber}, slot {item.slotnumber}</>}
                                        {item.command === "Execute a power by name" && <> - Power name: {item.powername}</>}
                                        {item.command === "Adjust throttle by percentage" && <> - Throttle Percentage change {item.throttleadjust}%</>}
                                    </span>
                                    <button className="removeitembutton" key={item.command} data-traynumber={item.traynumber} data-startslotnumber={item.startslotnumber} data-endslotnumber={item.endslotnumber} data-powername={item.powername} data-slotnumber={item.slotnumber} value={item.command} onClick={handleRemoveCommand}>Remove</button><br />
                                </>)
                            }
                        </div>

                    </section>

                    <section id="keybindsummary" className="formpart">
                        <h2 className="sectiontitle">Name and save your keybind</h2>
                        Keybind name: <input type="text" onChange={(e) => setBindName(e.target.value)} value={bindName}></input><br /><br />
                        <button onClick={handleSaveKeybind}>Save this keybind</button>

                        {savedKeybinds.map((item) =>
                            <>
                                <br />
                                <span className="savedkeybinddetails">{item.bindname}</span>
                                <button className="removeitembutton" value={item.bindname} key={item.bindname} onClick={handleDeleteSavedKeybind}>Remove</button><br />
                            </>)
                        }

                        <div id="finalstring">
                            {finalString}
                        </div>

                        <button onClick={handleCopyString}>Copy Bind String</button>
                    </section>
                </form>
            </div>

            <ToastContainer />
        </>
    )
}