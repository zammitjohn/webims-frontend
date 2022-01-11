import packageJson from '../../package.json';

function Footer() {
    return (
        <footer className="main-footer">
           &copy; {(new Date().getFullYear())} <a href="https://zammitjohn.com" target="_blank" rel="noreferrer"><strong>John Zammit</strong></a>.
           All rights reserved.
           <div className="float-right d-none d-sm-inline-block">
              <b>Version</b> { packageJson.version }
           </div>
        </footer>
       );
}

export default Footer;