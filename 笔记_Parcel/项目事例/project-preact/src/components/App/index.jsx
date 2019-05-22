import { h, render, Component } from 'preact';
import List from '../List/index';

export default class App extends Component {

    constructor ( props ) {

        super( props );

        this.state = {

            times : 0,
        };

        // 为了在回调中使用 `this`，这个绑定是必不可少的
        // https://react.docschina.org/docs/handling-events.html
        this.toUpdate = this.toUpdate.bind( this );
    }

    toUpdate ( evt ) {

        this.setState( state => ( {
            times : ++state.times
        } ) );
    }

    render () {

        return (
            <div>
                <List />
                <button onClick={this.toUpdate}>{'点我增加 : ' + this.state.times}</button>
            </div>
        );
    }
}