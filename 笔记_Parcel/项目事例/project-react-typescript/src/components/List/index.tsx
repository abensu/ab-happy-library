import React from 'react';
import iSelf from './index.d';

export default class List extends React.Component< iSelf.iProps, iSelf.iState > {

    constructor ( props ) {

        super( props );

        this.state = {

            datas : [
                {
                    id  : Math.random(),
                    txt : Math.random(),
                }
            ],
        };

        // 为了在回调中使用 `this`，这个绑定是必不可少的
        // https://react.docschina.org/docs/handling-events.html
        this.toUpdate = this.toUpdate.bind( this );
    }

    toUpdate ( evt ) {

        this.setState( state => {

            let d_arr = state.datas;

            d_arr.push( {
                id  : Math.random(),
                txt : Math.random(),
            } );

            return {
                datas : d_arr
            }
        } );
    }

    render () {

        const f_render_items = this.state.datas.map( item => (
            <div key={item.id}>{item.txt}</div>
        ) );

        return (
            <div>
                {f_render_items}
                <button onClick={this.toUpdate}>增加</button>
            </div>
        );
    }
}