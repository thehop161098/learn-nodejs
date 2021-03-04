import React, { Component } from 'react';

export default class Buttons extends Component {

    render() {
        const { buttons } = this.props;

        return (
            <div className="col-lg-12 col-md-4 col-7 input-col-custom">
                <div className="functionUser">
                    {buttons.map((button, index) => {
                        return (
                            <button key={index} className={`btn ${button.class}`}
                                onClick={() => button.click()}
                            ><i className={button.icon}></i> {button.name}</button>
                        )
                    })}
                </div>
            </div>

            // <div className="col-12 col-md-3">
            //     <div className="app-button text-right">
            //         {buttons.map((button, index) => {
            //             return (
            //                 <button key={index} className={`btn ${button.class}`}
            //                     onClick={() => button.click()}
            //                 ><i className={button.icon}></i> {button.name}</button>
            //             )
            //         })}
            //     </div>
            // </div>
        );
    }
}