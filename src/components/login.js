import React, { Component } from 'react';
import {  Button, message, Carousel, Tabs, Input } from 'antd';
import axios from 'axios';
import { connect } from "react-redux";
import { setUserData } from "../utils/auth-util";
import { setAuthData } from "../actions/auth";
import logo from '../img/31.png';
import {Link} from 'react-router-dom';


const TabPane = Tabs.TabPane;

class Login extends Component {

    constructor(props){
        super(props);
    }

    state = {
        patientName: "",
        doctorName: "",
        age:null,
        patientId:"",
        Phone:null,
        City:"",
        CIN:null

        
    }

    componentWillMount(){
        let { token } = this.props.auth;
        if(token)
            this.props.history.push('/home');
    }

    async login() {
        let { web3 } = this.props.global_vars;
        let that = this;
        
        let resp = await axios.get('/custom_auth/' + web3.eth.accounts[0]);
        if(resp && resp.data){
            web3.eth.sign(web3.eth.defaultAccount, web3.sha3(resp.data.challenge), async (err, signature) => {
                let auth_resp = await axios.get('/verify_auth/' + signature +"/?client_address="+web3.eth.defaultAccount);
                
                if (auth_resp.data && auth_resp.data.success) {

                    message.success("login success");
                    setUserData(auth_resp.data.user);
                    this.props.setAuthData(auth_resp.data.user);
                    that.props.history.push('/home');

                } else {
                    message.error("login failed"); 
                }
            });
        }
    }

    async registerDoctor(type) {
        let { CovidRecord, web3 } = this.props.global_vars;
        
        if(this.state.doctorName){
            let txn = await CovidRecord.signupDoctor
            .sendTransaction(this.state.doctorName,{"from":web3.eth.accounts[0]});
            
            if(txn)
                message.success("registered successfully as doctor");
            else
                message.error("registered unsuccessfull");
        }
    }

    async registerPatient() {
        let { CovidRecord, web3 } = this.props.global_vars;
        let { patientName, age } = this.state;

        if(patientName && parseInt(age)) {
            let txn = await CovidRecord.signupPatient
            .sendTransaction(patientName, parseInt(age) ,{"from":web3.eth.accounts[0]});
            
            if(txn)
                message.success("registered successfully as patient");
            else
                message.error("registered unsuccessfull");
        }        
    }
    async CheckPasseport() {
        let { CovidRecord, web3 } = this.props.global_vars;
        let { patientId } = this.state;

        if(patientId) {
            let txn = await CovidRecord.getPatientPasseportForAll
            .sendTransaction(patientId,{"from":web3.eth.accounts[0]});
            
            if(txn)
                message.success("check");
                this.setState({ patientId:""})
        }        
    }

    onTextChange(type, e){
        if(e && e.target)
            this.setState({[type]:e.target.value});
    }

    render() {
        let { token, name, role } = this.props.auth;
        return (
            <div >
                
		            
                    <img width={250} height={400} src={logo} alt="cover"/>
                {
                    role ? 
                    role :
                    <div className="loginFormTabs">
                        <Tabs type="card">
                            <TabPane  tab="Doctor" key="1" style={flexStyle}>
                            <Input className='inputBox' style={{width:"40%"}} value={this.state.doctorName} onChange={this.onTextChange.bind(this, 'doctorName')} size="small" placeholder="Your Name"/>
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.CIN} onChange={this.onTextChange.bind(this, 'CIN')} size="small" placeholder="CIN"/>
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.Phone} onChange={this.onTextChange.bind(this, 'Phone')} size="small" placeholder="Your phone number" />
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.City} onChange={this.onTextChange.bind(this, 'City')} size="small" placeholder="Your city" />

                                <Button  style={{width:"40%"}} type="primary" onClick={this.registerDoctor.bind(this, 'patient')} htmlType="submit" className="login-form-button registerButton">
                                    Register Doctor
                                </Button>
								<Button type="primary"  style={{width:"40%"}} onClick={this.login.bind(this)} htmlType="submit" className="login-form-button loginButton">
									Log in
								</Button>
                            </TabPane>
                            <TabPane tab="Patient" key="3" style={flexStyle}>
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.patientName} onChange={this.onTextChange.bind(this, 'patientName')} size="small" placeholder="Your Name"/>
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.age} onChange={this.onTextChange.bind(this, 'age')} size="small" placeholder="Your age"/>
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.CIN} onChange={this.onTextChange.bind(this, 'CIN')} size="small" placeholder="CIN" />
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.Phone} onChange={this.onTextChange.bind(this, 'phone')} size="small" placeholder="Your phone number" />
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.City} onChange={this.onTextChange.bind(this, 'City')} size="small" placeholder="Your city" />

                                <select className='inputBox' style={{width:"40%"}} required>
                                      <option selected disabled value="">Gender</option>
                                      <option value="male">Male</option>
                                      <option value="female">Female</option>
                               
                               </select>  


                                <Button  style={{width:"40%"}} type="primary" onClick={this.registerPatient.bind(this, 'patient')} htmlType="submit" className="login-form-button registerButton">
                                    Register Patient
                                </Button>
								<Button type="primary"  style={{width:"40%"}} onClick={this.login.bind(this)} htmlType="submit" className="login-form-button loginButton">
									Log in
								</Button>
                            </TabPane>
                            <TabPane  tab="Check someone's passeport" key="5" style={flexStyle}>
                                <Input className='inputBox' style={{width:"40%"}} value={this.state.patientId} onChange={this.onTextChange.bind(this, 'patientId')} size="small" placeholder="Patient Address"/>
                                <Button  style={{width:"40%"}} type="primary" onClick={this.CheckPasseport.bind(this, 'patientId')} htmlType="submit" className="login-form-button registerButton">
                                    Check passeport
                                    
                                </Button>
                            
                            </TabPane>
                        </Tabs>
                    </div> 
                }
            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column",
    justifyContent: "space-between"
}

const mapStateToProps = (state) => {
    return {
      global_vars: state.global_vars,
      auth: state.auth
    };
};

const actionCreators = {
    setAuthData
}
export default connect(mapStateToProps, actionCreators)(Login);