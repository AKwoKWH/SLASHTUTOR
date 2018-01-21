import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  currentUserInfo = {
    phonenumber: null,
    photoURLCustom64: null,
    photoURLCustom: null
  };
  isReadonlyForm = false;
  userInfoForm = {
    education: {Summary:null},
    expertArea: {Summary:null},
    degree: {Summary:null},
    expertLevel:{Summary:null},
    requestPay: null,
    userName: null,
    selfDescription: null,
    gender:{Summary:null}
  }; 

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(user => {
      this.afDB.collection('users').doc(user.uid).valueChanges().subscribe( userInfo =>{
        this.isReadonly(true);
        this.currentUserInfo = userInfo
        console.log(this.currentUserInfo)
        this.userInfoForm = {
          education: {Summary:this.currentUserInfo.education.Summary},
          expertArea: {Summary:this.currentUserInfo.expertArea.Summary},
          degree: {Summary:this.currentUserInfo.degree.Summary},
          expertLevel:{Summary:this.currentUserInfo.expertLevel.Summary},
          requestPay: this.currentUserInfo.requestPay,
          userName: this.currentUserInfo.userName,
          selfDescription: this.currentUserInfo.selfDescription,
          gender:{Summary:this.currentUserInfo.gender.Summary},
       }; 
      })
    }) 

  }

  GetUserProfile(){
    this.afAuth.authState.subscribe(user => {
      this.afDB.collection('users').doc(user.uid).valueChanges().subscribe( userInfo =>{
        this.currentUserInfo = userInfo
      })
    })    
  }

  editProfile(){  
    this.isReadonly(false)
  }

  isReadonly(edit){
    return this.isReadonlyForm = edit;
  }

  logForm() {
    
    this.isReadonly(true);

    this.afAuth.authState.subscribe(user => {
      if (user!=null){
        
        console.log(this.userInfoForm.expertLevel.Summary.value)

        const formatEducation = {
          Summary: this.userInfoForm.education.Summary, 
          HKU: this.userInfoForm.education.Summary.indexOf("HKU")>-1,
          CUHK: this.userInfoForm.education.Summary.indexOf("CUHK")>-1,
          HKUST: this.userInfoForm.education.Summary.indexOf("HKUST")>-1,
          HKIED: this.userInfoForm.education.Summary.indexOf("HKIED")>-1,
          Oversea: this.userInfoForm.education.Summary.indexOf("Oversea")>-1,
          Others: this.userInfoForm.education.Summary.indexOf("Others")>-1
        }  

        const formatExpertArea = {
          Summary: this.userInfoForm.expertArea.Summary,
          Chinese: this.userInfoForm.expertArea.Summary.indexOf("Chinese")>-1,
          English: this.userInfoForm.expertArea.Summary.indexOf("English")>-1,
          Mathematics: this.userInfoForm.expertArea.Summary.indexOf("Mathematics")>-1,
          Physics: this.userInfoForm.expertArea.Summary.indexOf("Physics")>-1,
          Chemistry: this.userInfoForm.expertArea.Summary.indexOf("Chemistry")>-1,
          Biology: this.userInfoForm.expertArea.Summary.indexOf("Biology")>-1,
          GeneralEducation: this.userInfoForm.expertArea.Summary.indexOf("General Education")>-1,
          AllSubjects: this.userInfoForm.expertArea.Summary.indexOf("All Subjects")>-1,
        }  

        const formatGender = {
          Summary: this.userInfoForm.gender.Summary,
          Male: this.userInfoForm.gender.Summary.indexOf("Male")>-1,
          Female: this.userInfoForm.gender.Summary.indexOf("Female")>-1,
          All: true,
        }  

        const formatExpLevel = {
          Summary: this.userInfoForm.expertLevel.Summary,
          Primary: this.userInfoForm.expertLevel.Summary.indexOf("Primary")>-1,
          SecondaryJunior: this.userInfoForm.expertLevel.Summary.indexOf("SecondaryJunior")>-1,
          SecondarySenior: this.userInfoForm.expertLevel.Summary.indexOf("SecondarySenior")>-1,
          University: this.userInfoForm.expertLevel.Summary.indexOf("University")>-1,
        }  

        const userDataFormat = {
          education: formatEducation,
          expertArea: formatExpertArea,
          expertLevel: formatExpLevel,
          gender: formatGender
        }

        const userData = this.userInfoForm
        this.afDB.collection("users").doc(user.uid).update(userData)
        this.afDB.collection("users").doc(user.uid).update(userDataFormat)
        console.log('Profile updated: ', userData, userDataFormat)
        this.GetUserProfile
      }else{
        console.log('Not Signed in')
      }

    })    
  }

  
ProfilePic(event){
  this.afAuth.authState.subscribe(user => {
    var fileCaptured = event.target.files[0];
    console.log(fileCaptured)
    if (fileCaptured != null){
      this.base64Converter(fileCaptured).then(data => {
        this.ImageResize('data:image/jpeg;base64,' + data).then(ResizedImg => {
            ResizedImg = 'data:image/jpeg;base64,' + ResizedImg 
            this.afDB.collection("users").doc(user.uid).update({photoURLCustom64: ResizedImg})
        })
     })
    }
  })
}

  base64Converter(file){
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.onload = (event) => {
        var Base64Img = event.target.result;
        var ConvertedBase64Img = Base64Img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      };
      reader.readAsDataURL(file);
    })
  }

ImageResize(fileCaptured){    
  return new Promise((resolve) => {
    var img = document.createElement("img");
    var canvas = document.createElement('canvas')
    img.src = fileCaptured
  
    img.onload = function() {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var MAX_WIDTH = 800;
      var MAX_HEIGHT = 600;
      var width = img.width;
      var height = img.height;

      if (width <= MAX_WIDTH && height <= MAX_HEIGHT){
        console.log('No need to resize')
        var ConvertedBase64Img = fileCaptured.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      } else {
        console.log('Need to resize')
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var Base64Img = canvas.toDataURL("image/png");
        var ConvertedBase64Img = Base64Img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      }
    }
  })
}


}
