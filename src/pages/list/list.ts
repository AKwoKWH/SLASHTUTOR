  import { Component } from '@angular/core';
  import { NavController, NavParams } from 'ionic-angular';

  import { AngularFirestoreDocument } from 'angularfire2/firestore';
  // import { AngularFirestoreCollection } from 'angularfire2/firestore';
  import { AngularFireAuth } from 'angularfire2/auth';
  import { AngularFirestore } from 'angularfire2/firestore';
  import { Observable } from 'rxjs/Observable';

  // export interface Item {}


  @Component({
    selector: 'page-list',
    templateUrl: 'list.html'
  })
  export class ListPage {

    userList;
    userListFilter;
    userListFilterArray;
    searchUserForm = {
      gender: 'All',
      subject: 'Chinese',
      education: [],
      level: []
    };



    constructor(
      public navCtrl: NavController,
      public afDB: AngularFirestore,
      public afAuth: AngularFireAuth
    ) {} 
    
    GetUserList(){  

      // var educationsubject = ['HKU','CUHK', 'HKUST', 'HKIED']
      // for (var i = 0, len = educationsubject.length; i < len; i++) {
      //   if (this.searchUserForm.education.indexOf(educationsubject[i])>-1){
      //     const formEduaction = 'education.' + educationsubject[i]
      //   } else {
      //     const formEduaction = 'dummy'        
      //     // this['formEduaction' + educationsubject[i]] = 'dummy'      
      //   }
      // }

      // const formGender = 'dummy'

      // if (this.searchUserForm.gender!='All'){
      //   const formGender = 'gender.' + this.searchUserForm.gender
      // } else {
      //   const formGender = 'dummy'
      // }

      const formSubject = 'expertArea.' + this.searchUserForm.subject
      const formLevel = 'expertLevel.' + this.searchUserForm.level
      const formGender = 'gender.' + this.searchUserForm.gender
    
      console.log(formGender,formLevel,formSubject)

      this.userListFilter = this.afDB.collection('users', ref => {
        return ref.where(formGender, '==', true)
                  .where(formSubject, '==', true)
                  .where(formLevel, '==', true)
        }).valueChanges()

      this.afDB.collection('users', ref => {
        return ref.where(formGender, '==', true)
                  .where(formSubject, '==', true)
                  .where(formLevel, '==', true)
      }).valueChanges().subscribe(result => {
        this.userListFilterArray = result
        console.log(result)
      })
    }


  SubmitRequest(){
      console.log(this.userListFilterArray)
      const subscriptionData = {Requrement: this.searchUserForm, Result: this.userListFilterArray}
      this.afAuth.authState.subscribe(user => {
        this.afDB.collection('users').doc(user.uid).valueChanges().subscribe( userInfo =>{
          this.afDB.collection("users").doc(user.uid).collection('subscription').add(subscriptionData)
        })
      })    
  }


    // jsonParser(stringValue) {

    //      var string = JSON.stringify(stringValue);
    //      var objectValue = JSON.parse(string);
    //      return objectValue['mm'];
    // }

    SelectPreference(turtorID){
      
      console.log(this.userListFilterArray)
    }



    UploadTestData(){
      var pushkey = this.afDB.createId();
      var RandPhoneNumber  = 90000000 + Math.round(Math.random()*10000000)
      var TestName = "USER #" + Math.round(Math.random()*100)
      var UserAvaliablity = {
        MonAM: Math.random() >= 0.5,
        MonNN: Math.random() >= 0.5,
        MonPM: Math.random() >= 0.5,
        TueAM: Math.random() >= 0.5,
        TueNN: Math.random() >= 0.5,
        TuePM: Math.random() >= 0.5,
        WedAM: Math.random() >= 0.5,
        WedNN: Math.random() >= 0.5,
        WedPM: Math.random() >= 0.5,
        ThuAM: Math.random() >= 0.5,
        ThuNN: Math.random() >= 0.5,
        ThuPM: Math.random() >= 0.5,
        FriAM: Math.random() >= 0.5,
        FriNN: Math.random() >= 0.5,
        FriPM: Math.random() >= 0.5,
        SatAM: Math.random() >= 0.5,
        SatNN: Math.random() >= 0.5,
        SatPM: Math.random() >= 0.5,
        SunAM: Math.random() >= 0.5,
        SunNN: Math.random() >= 0.5,
        SunPM: Math.random() >= 0.5,
      }    
      var UserEducation = {
        HKU: Math.random() >= 0.5,
        CUHK: Math.random() >= 0.5,
        HKUST: Math.random() >= 0.5,
        HKIED: Math.random() >= 0.5,
        Oversea: Math.random() >= 0.5,
        Others:  Math.random() >= 0.5
      }  
      var userExpertArea = {
        Chinese: Math.random() >= 0.5,
        English: Math.random() >= 0.5,
        Mathematics: Math.random() >= 0.5,
        Physics: Math.random() >= 0.5,
        Chemistry: Math.random() >= 0.5,
        Biology: Math.random() >= 0.5,
        GeneralEducation: Math.random() >= 0.5,
        AllSubjects: Math.random() >= 0.5
      }   

      const userExpLevel = {
        Primany: Math.random() >= 0.5,
        SecondaryJunior: Math.random() >= 0.5,
        SecondarySenior: Math.random() >= 0.5,
        University: Math.random() >= 0.5,
      }  

      var userGender = {
        Male: RandPhoneNumber % 2 == 1,
        Female: RandPhoneNumber % 2 != 1,
        All: true
      }   

      const userData = {
          phonenumber: RandPhoneNumber,
          userID: pushkey,
          selfDescription: "This is a auto-gen test user " + RandPhoneNumber,
          userName: TestName,
          gender: userGender,
          expertArea: userExpertArea,
          education: UserEducation,
          avaliablity: UserAvaliablity,
          expertLevel: userExpLevel,
          dummy: true
      }
      console.log(userData)
      this.afDB.collection("users").doc(pushkey).set(userData)
        
    }


  }
