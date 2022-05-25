import React, { Component } from 'react';
import {  Button, message } from 'antd';
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { Layout } from 'antd';

const { Header } = Layout;

class CustomHeader extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        let { token } = this.props.auth;
        
        if(!token)
            this.props.history.push('/login');
        else
            this.props.history.push('/home');
    }

    render() {
        let { token, name } = this.props.auth;
        
        return (
            <Header>
                <div style={{display:"flex", flexDirection:"row" ,justifyContent:"space-between"}}> 
                    {
                        token ? 
                        <div>
                            <h3 style={{color:"white"}}>Welcome {name}</h3>
                        </div>: ""
                    }
                    {
                        token ?
                        <div>
                            <Button type="primary" onClick={()=>{this.props.logout();this.props.history.push('./login');}} htmlType="submit" className="login-form-button">
                                Logout
                            </Button>
                        </div>:""
                    }
                </div>
            </Header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      global_vars: state.global_vars
    };
};

const actionCreators = {
    logout
}
export default connect(mapStateToProps, actionCreators)(CustomHeader);