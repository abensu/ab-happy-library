import React    from 'react';
import List     from '../List/index';
import iSelf    from './index.d';

export default class App extends React.Component< iSelf.iProps, iSelf.iState > {

    constructor ( props ) {

        super( props );

        this.state = {

            times : 0,
        };

        // 为了在回调中使用 `this`，这个绑定是必不可少的
        // https://react.docschina.org/docs/handling-events.html
        this.toUpdate = this.toUpdate.bind( this );
        this.toTouch = this.toTouch.bind( this );
    }

    toUpdate ( evt ) {

        const d_times = this.state.times + 1;

        this.setState( state => ( {
            times : d_times
        } ) );
    }

    toTouch ( evt ) {

        console.log( evt ); // 虽然显示对应字段为 null，但其实是有值的，例如 evt.touches
        console.log( this );
    }

    render () {

        return (
            <div>
                <List />
                <button onClick={this.toUpdate}>{'点我增加 : ' + this.state.times}</button>
                <button onTouchStart={this.toTouch}>touch 我</button>
            </div>
        );
    }
}