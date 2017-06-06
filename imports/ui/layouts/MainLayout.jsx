import React from 'react';
import AccountsUI from '../AccountsUI.jsx';
import EthereumAccounts from '../EthereumAccounts.jsx';


export const MainLayout = ({content}) => (

<div className ="MainLayout">
        <header className="dapp-header">
            <nav className="dapp_nav">
                    <ul>
                        <li><a><h3  className="title" >Ethereum Tickets Dapp</h3></a></li>
                        <li><a href=""></a></li>
                        <li><a href="/"><span><h3>Events</h3></span></a></li>
                        <li><a href="/transportServices"><span><h3>Transport</h3></span></a></li>
                        <li><a href="/myAccounts"><span><h3>Exchange</h3></span></a></li>
                        <li><a href="/about"><span><h3>About</h3></span></a></li>
                        <li><a href=""><EthereumAccounts/></a></li>
                        <li><AccountsUI/></li>             
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
            <h4>&copy; by Giulia Di Bella - 2017</h4>
        </footer>    
</div>

)
