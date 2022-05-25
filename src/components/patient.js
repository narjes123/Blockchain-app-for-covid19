import React, { Component } from 'react';
import {  Button, Input, message, Row, Col, Tag, Card, Collapse } from 'antd';
import { connect } from "react-redux";

const Panel = Collapse.Panel;

class Patient extends Component {

    constructor(props){
        super(props);
    }

    state = {
        name: "",
        age: 0,
        numCin: 0,
        contact: 0,
        city:"",
        gender: "",
        doctor_list: [],
        nbrDoses:0,
        showPopup:[],
        doctorId: null,
    }

    componentDidMount(){
        let { CovidRecord } = this.props.global_vars;
        
        if(CovidRecord)
            this.loadPatient(CovidRecord);
        
    }

    componentWillReceiveProps(nextProps){
        let { CovidRecord } = this.props.global_vars;
        if(CovidRecord !== nextProps.global_vars.CovidRecord) {
            this.loadPatient(nextProps.global_vars.CovidRecord);   
        }
    }

    async loadPatient(CovidRecord){
        let res = await CovidRecord.getPatientInfo.call();

        this.setState({name:res[0],age:res[1].toNumber(),numCin:res[2],contact:res[3],city:res[4],gender:res[5],doctor_list:res[6],nbrDoses:parseInt(res[7])})
    }

    async grantAccess(){
        let { CovidRecord, web3 } = this.props.global_vars;
        
        if(this.state.doctorId){
            let res = await CovidRecord.grantAccessToDoctor
            .sendTransaction(this.state.doctorId,{"from":web3.eth.accounts[0]});
            
            if(res) {
                message.success('access successful');
                this.setState({doctorId:null});
            }
        }
    }

    onTextChange(type, e){
        if(e && e.target)
            this.setState({[type]:e.target.value});
    }

    
    render() {
        let { name, age, numCin, contact, city, gender, doctor_list,nbrDoses } = this.state;
        let { web3 } = this.props.global_vars;
        let { token } = this.props.auth;


        return (
            <div>
                <Row gutter={16} style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <Col className='col-3' span={6}>
                        <Card bordered={true} >
                            <div className='userDetails'  style={flexStyle}>
									<h4>Name: {name}</h4>
									<h4>Age: {age}</h4>
                                    <h4>CIN: {numCin}</h4>
									<h4>Age: {age}</h4>
                                    <h4>Number of Doses: {nbrDoses}</h4>


                            </div>
                        </Card>
                    </Col>
                    <Col className='col-3' span={6}>
                        <Card bordered={true}>
                            <div style={flexStyle}>
                                <Input className='emailId' style={{width:"100%"}} value={this.state.doctorId} onChange={this.onTextChange.bind(this, 'doctorId')} size="small" placeholder="Doctor Address"/>
                                <Button type="primary" onClick={this.grantAccess.bind(this)} htmlType="submit" className="login-form-button loginButton">
                                    Grant Access
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    
                </Row>
                <Row gutter={16}>
                    <Collapse className='folderTab' defaultActiveKey={['1']}>
                        
                        <Panel header="Doctors List" key="1">
                            { 
                                doctor_list.map((doctor) => {
                                    return <Tag>{doctor}</Tag>
                                }) 
                            }
                        </Panel>
                    </Collapse>
                </Row>
            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      global_vars: state.global_vars,
    };
};

export default connect(mapStateToProps, {})(Patient);