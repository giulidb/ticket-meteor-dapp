import React from 'react';
import AccountsUI from '../AccountsUI.jsx';

export const MainLayout = ({content}) => (

<div className ="MainLayout">

        <header className="dapp-header">
            <h3> Welcome to Meteor!</h3>
        </header>

        <div className="dapp-flex-content">
            <aside className="dapp-aside">
                <nav>
                    <ul>
                        <li><a href="/" className="active"><span>Events</span></a></li>
                        <li><a href="/about"><span>About</span></a></li>                       
                    </ul>
                </nav>
            </aside>

            <main className="dapp-content">
                {content}            
            </main>

            <aside className="dapp-actionbar">
                <AccountsUI/>
                </aside>
        </div>
   
        <footer className="dapp-footer">
            <h3>Copyright by Giulia Di Bella - 2017</h3>
        </footer>    
</div>

)