export default function Tips() {
    return (
        <>
        <div className="basiccontentcontainer">
            <h1>Helpful tips</h1>
            <p>The following are some tips that will help you to create properly functional key binds. This is not an exhaustive list or guide of how to create good keybinds - you will likely want to read a full guide such as the one located on the <a href="https://stowiki.net/wiki/Guide:_Keybinds" target="_blank" rel="noreferrer">STO Wiki</a>. However, the following are some important points for you to mention if you are going to try and dive right in.</p>

            <h2>Space vs Ground Keybinds</h2>
            <p>Space and ground keybinds <strong>cannot</strong> be mixed in the same keybind. While this makes sense in practice (you can't use a ground power while you're in your ship) - this editor does not currently detect when you try to create a keybind which uses both space and ground keybinds. Therefore, make sure you create your keybinds carefully to avoid them not working.</p>


            {/* Add warning about key + commands not being saved when navigating away, only saved keybinds are kept */}
        </div>
        </>
    )
}