// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract CovidApp {
  address private owner;
  mapping (address => doctor) private doctors;// doctor and list of patient profile he can access
  mapping (address => mapping(address => uint)) private doctorToPatient;
  mapping (address => patient) private patients;
  mapping (address => mapping (address => uint)) private patientToDoctor;
  uint private gpos;
  struct patient {
      string name;
      uint8 age;
      address id;
      uint numCin;
      string gender;
      string contact;
      string city;
      address[] doctor_list;
      uint nbrDoses;
      string doseType;
      string doseDate;
      uint nbrInfections;
      string infectionDate;
  }
  
  struct doctor {
      string name;
      address id;
      uint CIN;
      uint Phone;
      address[] patient_list;
  }
  
  constructor() public {
    owner = msg.sender;
  }
  
  modifier checkDoctor(address id) {
    doctor memory d = doctors[id];
    require(d.id > address(0x0));//check if doctor exist
    _;
  }
  
  modifier checkPatient(address id) {
    patient memory p = patients[id];
    require(p.id > address(0x0));//check if patient exist
    _;
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  function signupPatient(string memory _name, uint8 _age, uint _numCin, string memory _gender, string memory _contact, string memory _city) public {
     patient memory p = patients[msg.sender];
     require(keccak256(abi.encodePacked(_name)) != keccak256(""));
     require((_age > 0) && (_age < 100));
     require(!(p.id > address(0x0)));

     patients[msg.sender] = patient({name:_name,age:_age,id:msg.sender,numCin:_numCin,gender:_gender,contact:_contact,city:_city,doctor_list:new address[](0),nbrDoses:0,doseType:"",doseDate:"",nbrInfections:0,infectionDate:""});
  }
  
  function signupDoctor(string memory _name, uint CIN, uint Phone) public {
      doctor memory d = doctors[msg.sender];
      require(keccak256(abi.encodePacked(_name)) != keccak256(""));
      require(!(d.id > address(0x0)));

      doctors[msg.sender] = doctor({name:_name,CIN:_CIN,Phone:_Phone,id:msg.sender,patient_list:new address[](0)});
  }
  
  function grantAccessToDoctor(address doctor_id) public checkPatient(msg.sender) checkDoctor(doctor_id) {
      patient storage p = patients[msg.sender];
      doctor storage d = doctors[doctor_id];
      require(patientToDoctor[msg.sender][doctor_id] < 1);// this means doctor already been access
      
      uint pos = p.doctor_list.push(doctor_id);// new length of array
      gpos = pos;
      patientToDoctor[msg.sender][doctor_id] = pos;
      d.patient_list.push(msg.sender);
  }
  
  
  function getPatientInfo() public view checkPatient(msg.sender) returns(string memory, uint8, address[] memory, uint ) {
      patient memory p = patients[msg.sender];
      return (p.name, p.age, p.doctor_list, p.nbrDoses);
  }
  
  function getDoctorInfo() public view checkDoctor(msg.sender) returns(string memory, address[] memory){
      doctor memory d = doctors[msg.sender];
      return (d.name, d.patient_list);
  }
  
  function checkProfile(address _user) public view onlyOwner returns(string memory, string memory){
      patient memory p = patients[_user];
      doctor memory d = doctors[_user];
      
      if(p.id > address(0x0))
          return (p.name, 'patient');
      else if(d.id > address(0x0))
          return (d.name, 'doctor');
      else
          return ('', '');
  }
  
  function getPatientInfoForDoctor(address pat) public view checkPatient(pat) checkDoctor(msg.sender) returns(string memory, uint8, uint, address){
      patient memory p = patients[pat];

      require(patientToDoctor[pat][msg.sender] > 0);

      return (p.name, p.age, p.nbrDoses, p.infectionDate, p.id);
  }
  function addDose(address pat, string memory _doseType, string memory _doseDate) public view checkPatient(pat) checkDoctor(msg.sender) returns(uint) {
    patient memory p = patients[pat];

    require(patientToDoctor[pat][msg.sender] > 0);

    p.doseType = _doseType;
    p.doseDate = _doseDate;
    p.nbrDoses += 1;
    return(p.nbrDoses);
  }
  function addInfection(address pat, string memory _infectionDate) public view checkPatient(pat) checkDoctor(msg.sender) returns(uint) {
    patient memory p = patients[pat];

    require(patientToDoctor[pat][msg.sender] > 0);

    p.infectionDate = _infectionDate;
    
    p.nbrInfections = p.nbrInfections + 1;
    return(p.nbrInfections);
  }
  
  
  function getPatientPasseportForAll(address pat) public view checkPatient(pat)returns(string memory, uint) {
    patient memory p = patients[pat];
        require(p.nbrDoses >= 2, "Patient hasn't a vaccination passeport yet!");

    return(p.name,  p.CIN, p.age,p.city, p.nbrDoses, p.infectionDate);
  }
}