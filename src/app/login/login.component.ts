import { User } from './../classes/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  error: { name: String; message: '' } = { name: '', message: '' }; //for handle firebase error
  user: any;
  checked = false;
  userSignIn: any;
  authState: any = null;
  user_id: any = null;

  constructor(
    private router: Router,
    private afu: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {
    this.afu.authState.subscribe((auth: any) => {
      this.authState = auth;
      if (this.authState) {
        this.router.navigate(['/']);
      }
    });
  }

  navigateToSignup() {
    this.router.navigate(['/register']);
  }
  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  async login() {
    this.clearErrorMessage();
    this.user = await this.loginWithEmail(this.email, this.password).then(
      (res) => {
        if (res == false) {
          this.errorMessage = 'Invalid Email or Password';
          alert(this.errorMessage);
        } else {
          localStorage.setItem('role', res.role);
          if (res.role == 'AppUser') {
            this.router.navigate(['/forbidden']);
          } else if (res.role == 's-admin') {
          } else if (res.role == 'admin' || res.role == 'admin-designer') {
            this.router.navigate(['/']);
          }
        }
      }
    );
  }

  navigateToForgot() {
    this.router.navigate(['/forgot']);
  }

  async loginWithEmail(email: string, password: string) {
    try {
      this.userSignIn = await this.afu.signInWithEmailAndPassword(
        email,
        password
      );

      this.authState = this.userSignIn;
      this.user_id = this.userSignIn.user?.uid;

      localStorage.setItem('user_id', this.user_id);

      const datas = this.fireStore.collection('Users').doc(this.user_id).get();

      await datas.forEach((d: any) => {
        this.user = d.data() as User;
      });
      localStorage.setItem('company_name', this.user['company_name']);
      localStorage.setItem(
        'username',
        this.user['first_name'] + ' ' + this.user['last_name']
      );
      return this.user;
    } catch (err) {
      return false;
    }

    // .then(async (user: any) => {
    //   this.authState = user;
    //   this.user_id = user.user?.uid;

    //   // this.localStorage.saveInLocal("user_id",this.user_id);
    //   localStorage.setItem("user_id", this.user_id);
    //   globalVariables.updateValue(this.user_id);
    //   const datas = this.fireStore.collection("Users").doc(this.user_id).get();

    //   await datas.forEach((d: any) => {
    //     this.user = d.data() as User;
    //   });

    //   // datas.subscribe(d => {
    //   //    this.user = d.payload.data() as User;
    //   //    return this.user;
    //   // });
    //   // return this.user;
    //   // .pipe(
    //   //   map((changes) => {
    //   //     const data = changes.data();

    //   //     this.user.id=this.user_id;
    //   //     return { ...data as User };
    //   //   })
    //   // );
    //   // console.log(datas);
    //   //   this.user.id=this.user_id;
    //   //   datas.forEach((d:any)=> {
    //   //     this.user = (d.payload.doc.data() as User);
    //   //   })

    // }).catch(error => {
    //   throw error;
    // })
    // this.datas.forEach(this.datas,function(value,key) {

    // });
    return this.user;
  }

  ngOnInit(): void {}
}
