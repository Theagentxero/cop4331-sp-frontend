const _ = require('underscore');
const uuidv4 = require('uuid/v4');
const phoneLib = require('./phoneNumbers.js');

class Contact{
    constructor(cont){
        this.localID = uuidv4();
        // TODO: Excape HTML Characters In All Visible Fields
        if(_.has(cont, "_id")){
            this.isNew = false;
            this.id = cont._id;
        }else{
            this.isNew = true;
            this.id = null;
        }
        // Safely Get First Name
        if(_.has(cont, "firstName") && cont.firstName != null){
            this.firstName = cont.firstName;
        }else{
            this.firstName = "";
        }
        // Safely Get Middle Name
        if(_.has(cont, "middleName") && cont.middleName != null){
            this.middleName = cont.middleName;
        }else{
            this.middleName = "";
        }
        // Safely Get Last Name
        if(_.has(cont, "lastName") && cont.lastName != null){
            this.lastName = cont.lastName;
        }else{
            this.lastName = "";
        }
        this.phoneNumbers = [];
        if(_.has(cont, "phoneNumbers") && cont.phoneNumbers != null){
            cont.phoneNumbers.forEach(phoneNum => {
                this.phoneNumbers.push( new SubContactItem('phone', phoneNum));
            });
        }
        this.emails = [];
        if(_.has(cont, "emails") && cont.emails != null){
            cont.emails.forEach(email => {
                this.emails.push( new SubContactItem('email', email));
            });
        }
    }
    getPhoneNumbers(){
        return this.phoneNumbers;
    }
    getEmails(){
        return this.emails;
    }
    dbPrep(){
        var x = {
            phoneNumbers: [],
            emails: []
        };
        // Set ID If Exists
        if(!this.isNew){
            x._id = this.id;
        }
        // Add Names If Exists
        if(this.firstName != "" && this.firstName != null){
            x.firstName = this.firstName;
        }
        if(this.middleName != "" && this.middleName != null){
            x.middleName = this.middleName;
        }
        if(this.lastName != "" && this.lastName != null){
            x.lastName = this.lastName;
        }
        // Set Phone Numbers
        if(this.phoneNumbers.length != 0){
            this.phoneNumbers.forEach((ph)=>{
                var tmp = ph.getObj();
                if(tmp != null){
                    x.phoneNumbers.push(tmp);
                }
            });
        }
        // Set Emails
        if(this.emails.length != 0){
            this.emails.forEach((em)=>{
                var tmp = em.getObj();
                if(tmp != null){
                    x.emails.push(tmp);
                }
            });
        }
        return x;
    }
    getLocalID(){
        return this.localID;
    }
    dbID(){
        return this.id;
    }
    formattedName(){
        var buildUp = "";
        var addSpace = false;
        if(this.firstName != ""){
            buildUp = this.firstName;
            addSpace = true;
        }
        if(this.middleName != ""){
            (addSpace) ? buildUp = buildUp + " " : buildUp = buildUp + "";
            buildUp = buildUp + this.middleName;
            addSpace = true;
        }
        if(this.lastName != ""){
            (addSpace) ? buildUp = buildUp + " " : buildUp = buildUp + "";
            buildUp = buildUp + this.lastName;
        }
        return buildUp;
    }
    alterFirstName(val){
        if(val != null && val != ""){
            this.firstName = val
        }else{
            this.firstName = ""
        }
    }
    alterMiddleName(val){
        if(val != null && val != ""){
            this.middleName = val
        }else{
            this.middleName = ""
        }
    }
    alterLastName(val){
        if(val != null && val != ""){
            this.lastName = val
        }else{
            this.lastName = ""
        }
    }
    addPhoneNumber(ph){
        if(ph == undefined || ph == null || ph == {}){
            this.phoneNumbers.push( new SubContactItem('phone', {}));
        }else{
            this.phoneNumbers.push( new SubContactItem('phone', ph));
        }
    }
    addEmail(em){
        if(em == undefined || em == null || em == {}){
            this.emails.push( new SubContactItem('email',{}));
        }else{
            this.emails.push( new SubContactItem('email',em));
        }
    }
    removePhoneNumber(localPhoneID){
        this.phoneNumbers = this.phoneNumbers.filter( (ph) => {return ph.getLocalID() != localPhoneID; });
    }
    removeEmail(localEmailID){
        this.emails = this.emails.filter( (em) => {return em.getLocalID() != localEmailID; });
    }
    phoneNumberCount(){
        return this.phoneNumbers.length;
    }
    emailNumberCount(){
        return this.emails.length;
    }
}


// Handler For Emails and Phone Numbers
class SubContactItem{
    constructor(type, itm){
        this.localID = uuidv4();
        this.type = type;
        if(_.has(itm, "_id")){
            this.isNew = false;
            this.id = itm._id;
        }else{
            this.isNew = true;
            this.id = "";
        }
        if(_.has(itm, "name")){
            this.name = itm.name;
        }else{
            this.name = "";
        }
        if(_.has(itm, "value")){
            if(this.type == 'phone'){
                this.value = phoneLib.format(itm.value);
            }else{
                this.value = itm.value;
            }
        }else{
            this.value = "";
        }
    }
    checkValidity(){
        // Considered Valid If Both Name and Value Are Filled
        if(this.name != "" && this.value != ""){
            return true;
        }else{
            return false;
        }
    }
    getObj(){
        // Returns An Object For This Item If It Is Valid
        if(this.checkValidity()){
            var x = {
                name: this.name
            };
            if(this.type == 'phone'){
                x.value = phoneLib.clean(this.value);
            }else{
                x.value = this.value;
            }
            if(this.id != ""){
                x._id = this.id;
            }
            return x;
        }else{
            return null;
        }
        
    }
    getLocalID(){
        return this.localID;
    }
    dbID(){
        return this.id;
    }
    alterName(name){
        if(name != null && name != ""){
            this.name = name;
        }else{
            this.name = ""
        }
    }
    alterValue(val){
        if(val != null && val != ""){
            this.value = val;
        }else{
            this.value = ""
        }
    }
}
module.exports = {
    Contact,
    SubContactItem
};