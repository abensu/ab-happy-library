import { h, render, Component } from 'preact';
import img_1_url from './res/1.png'; // react 的静态资源引入。。。MGJJ
import './index.css';

export default class List extends Component {

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
            <div key={item.id} className="item"><img src={img_1_url} />{item.txt}</div>
        ) );

        return (
            <div className="List">
                {f_render_items}
                <button onClick={this.toUpdate}>增加</button>
            </div>
        );
    }
}