import React from 'react';
import AccountsUI from '../AccountsUI.jsx';

export const MainLayout = ({content}) => (

<div className ="MainLayout">

        <header className="dapp-header">
            <h3>Tickets Ethereum App</h3>
            <nav>
                    <ul>
                        <li><a href="/"><span>Events</span></a></li>
                        <li><a href="/about"><span>My Tickets</span></a></li>
                        <li><a href="/myAccounts"><span>My Accounts</span></a></li>
                        <li><a><AccountsUI/></a></li>
                    </ul>
                </nav>
        </header>

        <div className="dapp-flex-content">
            <main className="dapp-content">
                {content}            
            </main>

            <aside className="dapp-actionbar">
            </aside>
        </div>
   
        <footer className="dapp-footer">
            <h4>Copyrigth &copy; by Giulia Di Bella - 2017</h4>
        </footer>    
</div>

)