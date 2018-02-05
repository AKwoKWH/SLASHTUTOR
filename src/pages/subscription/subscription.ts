import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html'
})
export class SubscriptionPage {

  userList;
  searchUserForm={};
  stripetoken=null

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {} 

  showStripe() {
    console.log("stripe")
    var stripeHandler = StripeCheckout.configure({
      key: 'pk_test_NZKbrnkUnacIu2w4QR7m07HR',
      token: function(token) {}
    });
    stripeHandler.open({
      name: 'Skydive me Please',
      description: 'Im freeee fallin',
      zipCode: true,
      currency: "usd",
      amount: 20000
    });
  };


  showStripeSub() {

    // const scripe = document.createElement('scripe');

    // scripe.async = true;
    // scripe.src = 'https://js.stripe.com/v2';
    // document.body.appendChild(scripe);
    // scripe.setPublishableKey('pk_test_xxxxx');


    // var stripe = require("stripe")("sk_test_9zPAh6MjikaTTvTvDzFOTxax");

    // const plan = stripe.plans.create({
    // currency: 'usd',
    // interval: 'month',
    // name: 'Basic Plan',
    // amount: 0,
    // });

    // const customer = stripe.customers.create({
    // email: 'jenny.rosen@example.com',
    // });

    // const subscription = stripe.subscriptions.create({
    // customer: 'cus_4fdAW5ftNQow1a',
    // items: [{plan: 'plan_CBXbz9i7AIOTzr'}],
    // });
  
    // stripe.invoiceItems.create({
    //   amount: 1000,
    //   currency: 'usd',
    //   customer: 'cus_4fdAW5ftNQow1a',
    //   description: 'One-time setup fee',
    // });

    var stripeHandler = StripeCheckout.configure({
      key: 'pk_test_I5OWPdub303pbnyHjSfFoOJw',
      token: token => {
        console.log(token.id);
        this.stripetoken = token.id
        // this.checkoutService.postToken(token);
      }
    });
    
    stripeHandler.open({
      name: 'Testing Payment',
      description: 'this is a STRIPE Payment Gateway testing',
      zipCode: true,
      currency: "hkd",
      amount: 20000
    });
  }
}
