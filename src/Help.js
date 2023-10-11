import trayexpansion from "./images/trayexpansion.png"

export default function Help() {
    return (<>

        <main className="basiccontentcontainer">
            <h1>STO Bind Help</h1>

            <h2>What are keybinds in Star Trek Online?</h2>
            <p>Keybinds are a way of triggering specific actions based upon a key (or combination or keys) that you have set. They help to speed up common gameplay actions and allow you to potentially improve your gameplay. Commonly, players will place their DPS cooldown powers on an unused tray (see below), and then create a keybind where one key will cause all of the powers on that tray to be executed.</p>

            <h2>How do I use the bind editor?</h2>
            <p>
                The editor shows you the step-by-step process you use to create your keybinds. The process is as follows:
                <ol>
                    <li>Decide what key(s) you want to press to activate your keybind (in the example of DPS cooldowns above, many players chose the space bar)</li>
                    <li>Add the command that pressing the key combination shoudl run in step 2. (using the same example, you would want to choose "Execute a full tray", and then input tray number 10.)</li>
                    <li>Confirm you want to add the command to the list. Add any further commands that your keybind should trigger.</li>
                    <li>Copy the command text - this can be pasted in the chat window in game, pressing enter will cause your keybind to save.</li>
                </ol>
            </p>

            <h2>How do I see extra trays?</h2>
            <img alt="A partial screenshot of the power bars at the bottom of Star Trek Online. A small icon with three diagonally arranged boxes is highlighted, indicating that this was used to open a menu above it with the numbers 1 through 10, allowing for selection of the number of trays shown." src={trayexpansion} />
            <p>Using the button on the trays, you will see the option to show up to ten trays. You can add powers to these trays and then hide them - the powers will still be on those bars even if hidden, and can still be triggered by your keybinds.</p>
            
            <h2>I made a mistake and have a keybind I no longer want. What do I do?</h2>
            <p>If you have created a keybind that doesn't work how you want it to, or you just don't want it anymore, you can use the following command structure:</p>
            <pre>/unbind <i>key-name</i></pre>
            <p>You may wish to check the list of key names on the STO wiki before doing this. Alternatively you can set all your keybinds to default settings.</p>
            <div className="warning-box">This command will reset all your keybinds to default, even settings you created outside of this editor.</div>
            <pre>/unbind_All</pre>

            <h2 id="exportexisting">How do I export my existing key binds?</h2>
            <p>From the games chat window, run the command <span className="codesnippet">/bindsavefile mykeybinds.txt</span>. You can of course change the file name to whatever you want. This file will be saved in the "Live" subfolder of your Star Trek Online installation. To get rid of keybinds and restore the ones you have exported, run the unbind command above, then run <span className="codesnippet">/bindloadfile mykeybinds.txt</span>.</p>

        </main>

    </>)
}