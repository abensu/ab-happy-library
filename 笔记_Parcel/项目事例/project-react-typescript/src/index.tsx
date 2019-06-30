import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './components/App/index';

window[ 'React' ] = React; // bugfix : 编译后，会出现 React 未定义

ReactDOM.render(
    <App />,
    document.getElementById( 'app' )
);