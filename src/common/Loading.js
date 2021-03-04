import React, { Component } from 'react';

export default class Loading extends Component {

    render() {
        return (
            <div className="overlay">
                <div className="m-loader mr-4">
                    <svg className="m-circular" viewBox="25 25 50 50">
                        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                    </svg>
                </div>
            </div>
        );
    }
}