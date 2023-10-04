export default function Home() {
  return (
    <>
            <main className="basiccontentcontainer">

              <h2>Welcome to the <span className="go-tomato">STO Bind</span> tool</h2>

              <p>Please note this web app is experimental and may not behave as expected.</p>

              <p class="inline-warning"><span className="go-tomato">WARNING:</span> Clearing your browser's cache will cause saved information to be lost. Please be sure to export your key binds before you do.</p>

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