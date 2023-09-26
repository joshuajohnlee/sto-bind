export default function Home() {
  return (
    <>
            <main>

              <h2>Welcome to the <span className="go-tomato">STO Bind</span> tool</h2>

              <p>Please note this web app is experimental and may not behave as expected.</p>

              <p><span className="go-tomato">WARNING:</span> Clearing your browser's cache will cause saved information to be lost. Please be sure to export your key binds before you do this.</p>

              <nav id="nav-standard">
                <a href="#/editor" id="b-one">Launch Editor</a>
              </nav>

              <footer>
                <div className="footer-inside">
                  <div className="footer-text">

                    <p> Created by JoystickJoshy - source available on <a href="https://github.com/joshuajohnlee/sto-bind">GitHub</a>
                    </p>

                    <p>
                      LCARS Inspired Website Template by <a href="https://www.thelcars.com">www.TheLCARS.com</a>, with modifications.
                    </p>

                  </div>
                </div>
                <div className="footer-panel"> <span className="hop">22</span>47 </div>
              </footer>
            </main>
    </>
  );
}