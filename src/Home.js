export default function Home() {
  return (
    <>
            <main className="basiccontentcontainer">

              <h2>Welcome to the <span className="go-tomato">STO Bind</span> tool</h2>

              <p>This is a tool intended to be a quick and (mostly) pain-free way to create keybinds for Star Trek Online. It is not an exhaustive tool and may lack some commands or features (<a href="https://github.com/joshuajohnlee/sto-bind/issues" target="_blank" rel="noreferrer">you can request features here</a>!) Please note this web app is still experimental and may not behave as expected.</p>

              <p>If you require a more in-depth tool, you may want to try <a href="https://sourceforge.net/projects/sto-keybind/" target="_blank" rel="noreferrer">the existing STO Keybind</a> application by jeffvan. This web app is not intended as competition or a replacement, merely an alternative for those who don't want to download and install the software, or who only need to make a few keybinds at a time.</p>

              <p class="warning-box"><span className="go-tomato">WARNING:</span> Clearing your browser's cache will cause saved information to be lost. Please be sure to export your key binds before you do.</p>

              <nav id="nav-standard">
                <a href="#/editor" id="b-one">Launch Editor</a>
              </nav>

              <footer>
                    <p> Created by JoystickJoshy - source available on <a href="https://github.com/joshuajohnlee/sto-bind">GitHub</a></p>
              </footer>
            </main>
    </>
  );
}