import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let commands = require('./data/commands.json');

var commandList = []

Object.keys(commands).forEach(function (commandtype) {
    Object.keys(commands[commandtype]).forEach(function (key) {
        commandList.push(key);
    });
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

    // State creation //

    const [currentSelectedCommand, setCurrentSelectedCommand] = useState("Execute a power by name");
    const [confirmedCommands, setConfirmedCommands] = useState([]);
    const [bindName, setBindName] = useState("");
    const [ctrlSetting, setCtrlSetting] = useState("fornoctrl");
    const [shiftSetting, setShiftSetting] = useState("fornoshift");
    const [altSetting, setAltSetting] = useState("fornoshift");
    const [keySetting, setKeySetting] = useState("Space bar");
    const [trayNumber, setTrayNumber] = useState(1)
    const [slotNumber, setSlotNumber] = useState(1)
    const [startSlotNumber, setStartSlotNumber] = useState(1)
    const [endSlotNumber, setEndSlotNumber] = useState(1)
    const [powerName, setPowerName] = useState("")
    const [throttleAdjust, setThrottleAdjust] = useState(0)
    const [bindString, setBindString] = useState("Test bind string")

    //                            //
    //  BUTTON AND FORM HANDLERS  //
    //                            //

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
        } else {
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
                setConfirmedCommands([...confirmedCommands, { "command": currentSelectedCommand }])
            }
        }

    }

    function handleRemoveCommand(e) {
        e.preventDefault();
        let newCommandArray = confirmedCommands.filter(item => item.command !== e.target.value && item.tray)
        setConfirmedCommands(newCommandArray)
    }

    function handleKeyChange(e) {
        setKeySetting(e.target.value);
    }

    function handleCommandChange(e) {
        setCurrentSelectedCommand(e.target.value);
    }

    function handleNameChange(e) {
        e.preventDefault();
        setBindName(e.target.value);
    }

    function handleCtrlChange(e) {
        setCtrlSetting(e.target.value)
    }

    function handleShiftChange(e) {
        setShiftSetting(e.target.value)
    }

    function handleAltChange(e) {
        setAltSetting(e.target.value)
    }

    function handleTrayNumberChange(e) {
        setTrayNumber(e.target.value);
    }

    function handleSlotNumberChange(e) {
        setSlotNumber(e.target.value);
    }

    function handlePowerNameChange(e) {
        setPowerName(e.target.value);
    }

    function handleStartSlotNumberChange(e) {
        setStartSlotNumber(e.target.value)
    }

    function handleEndSlotNumberChange(e) {
        setEndSlotNumber(e.target.value)
    }

    function handleThrottleAdjustChange(e) {
        setThrottleAdjust(e.target.value)
    }

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

    // Create bind string functions

    function handleCopyString(e) {
        e.preventDefault()
        navigator.clipboard.writeText(bindString)
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

    const [savedCommandsList, setSavedCommandsList] = useState([])

    function saveCommand(e) {
        e.preventDefault()
        setSavedCommandsList([...savedCommandsList, {"name": {bindName}, "command": {confirmedCommands}}])
        saveToLocalStorage()
    }

    function saveToLocalStorage() {
        localStorage.setItem('savedbinds', JSON.stringify(savedCommandsList));
    }

    function deleteSavedCommands(e) {
        e.preventDefault()
    
        if (window.confirm("Are you sure you want to delete the saved key binds?") == true) {
            localStorage.removeItem('savedbinds');
            toast.success('Your saved keybinds were deleted.)', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
        }
    }

    return (
        <>
            <div id="editorcontainer">
                <form className="editorform">

                    <h2>Build your keybind</h2>

                    <section id="keysetter" className="formpart">
                        <h3 className="sectiontitle"> Step one: select the key combination to use</h3>
                        <div id="ctrlblock">
                            <label htmlFor='ctrlsetting'>CTRL Key:</label>
                            <fieldset name="ctrlsetting">
                                <input type="radio" value="noctrl" name="ctrlsettinggroup" onChange={handleCtrlChange} defaultChecked={true} /> No control key<br />
                                <input type="radio" value="anyctrl" name="ctrlsettinggroup" onChange={handleCtrlChange} /> Either control key<br />
                                <input type="radio" value="leftctrl" name="ctrlsettinggroup" onChange={handleCtrlChange} /> Left control key<br />
                                <input type="radio" value="rightctrl" name="ctrlsettinggroup" onChange={handleCtrlChange} /> Right control key
                            </fieldset>
                        </div>

                        <div id="shiftblock">
                            <label htmlFor='shiftsetting'>Shift Key:</label>
                            <fieldset name="shiftsetting">
                                <input type="radio" value="noshift" name="shiftsettinggroup" onChange={handleShiftChange} defaultChecked={true} /> No shift key<br />
                                <input type="radio" value="anyshift" name="shiftsettinggroup" onChange={handleShiftChange} />  Either shift key<br />
                                <input type="radio" value="leftshift" name="shiftsettinggroup" onChange={handleShiftChange} /> Left shift key<br />
                                <input type="radio" value="rightshift" name="shiftsettinggroup" onChange={handleShiftChange} /> Right shift key
                            </fieldset>
                        </div>

                        <div id="altblock">
                            <label htmlFor='altsetting'>Alt Key:</label>
                            <fieldset name="altsetting">
                                <input type="radio" value="noalt" name="altsettinggroup" defaultChecked={true} onChange={handleAltChange} /> No alt key<br />
                                <input type="radio" value="anyalt" name="altsettinggroup" onChange={handleAltChange} /> Either alt key<br />
                                <input type="radio" value="leftalt" name="altsettinggroup" onChange={handleAltChange} /> Left alt key<br />
                                <input type="radio" value="rightalt" name="altsettinggroup" onChange={handleAltChange} /> Right alt key
                            </fieldset>
                        </div>

                        <div id="keyblock">
                            <label htmlFor='keyselector'>Choose a key or button:</label>
                            <select name="keyselector" onChange={handleKeyChange} >
                                {keyList.map(x => <option value={x} key={x}>{x}</option>)}
                            </select>
                        </div>

                        <div id="keyconfirmation">
                            Your key combination will be<strong>
                                {ctrlSetting == "anyctrl" && <>Ctrl + </>} {ctrlSetting == "leftctrl" && <>Left Ctrl + </>} {ctrlSetting == "rightctrl" && <>Right Ctrl + </>} {shiftSetting == "anyshift" && <>Shift + </>} {shiftSetting == "leftshift" && <>Left Shift + </>} {shiftSetting == "rightshift" && <>Right Shift + </>} {altSetting == "anyalt" && <>Alt + </>} {altSetting == "leftalt" && <>Left Alt + </>} {altSetting == "rightalt" && <>Right Alt + </>} {keySetting}</strong>
                        </div>
                    </section>

                    <section id="commandsetter" className="formpart">
                        <h3>Step Two: Set the commands to run</h3>
                        <label htmlFor="commandselector">Choose a command:</label>
                        <select name="commandselector" value={currentSelectedCommand} onChange={handleCommandChange}>
                            {commandList.map(x => <option value={x} key={x}>{x}</option>)}
                        </select>

                        {currentSelectedCommand === "Execute a single tray command" &&
                            <>
                                Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={handleTrayNumberChange}></input>
                                Slot number: <input type="number" name="slotnumber" min="1" max="10" onChange={handleSlotNumberChange}></input>
                            </>
                        }

                        {currentSelectedCommand === "Execute a full tray" &&
                            <>
                                Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={handleTrayNumberChange}></input>
                            </>
                        }

                        {currentSelectedCommand === "Execute a partial tray" &&
                            <>
                                Tray number: <input type="number" name="traynumber" min="1" max="10" onChange={handleTrayNumberChange}></input>
                                Starting slot number: <input type="number" name="startslotnumber" min="1" max="10" onChange={handleStartSlotNumberChange}></input>
                                Ending slot number: <input type="number" name="startslotnumber" min="1" max="10" onChange={handleEndSlotNumberChange}></input>
                            </>
                        }

                        {currentSelectedCommand === "Execute a power by name" &&
                            <>
                                Power name: <input type="text" name="powername" min="1" max="10" onChange={handlePowerNameChange}></input>
                            </>
                        }

                        {currentSelectedCommand === "Adjust throttle by percentage" &&
                            <>
                                Power name: <input type="number" name="throttlechange" min="-100" max="100" onChange={handleThrottleAdjustChange}></input>
                            </>
                        }

                        <button onClick={handleAddCommand}>Add command to this keybind</button>
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
                                    </span>
                                    <button className="removeitembutton" value={item.command} onClick={handleRemoveCommand}>Remove</button><br />
                                </>)
                            }
                        </div>

                    </section>

                    <section id="keybindsummary" className="formpart">
                        <h3>Name and save your keybind</h3>
                        Keybind name: <input type="text" onChange={handleNameChange} value={bindName}></input><br /><br />

                        Stored keybinds: {
                        savedCommandsList.map((item) => <>{item.bindName}</>
                        )
                        }

                        <button onClick={handleCopyString}>Copy keybind string</button>
                        <button onClick={saveCommand}>Save keybind to your binds list</button>
                        <button onClick={deleteSavedCommands}>Delete all saved bindings</button>
                    </section>
                </form>
            </div>

            <ToastContainer />
        </>
    )
}