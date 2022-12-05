import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  first_name: string = '';
  company_name: string = '';
  last_name: string = '';
  email: string = '';
  password: string = '';
  conf_password: string = '';
  jobDescription: string = '';
  loading = true;

  individual: boolean = true;
  authState = null;
  sucMessage: string = '';
  FMessage: string = '';

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

  register_action() {
    this.loading = true;
    if (this.password != this.conf_password) {
      this.FMessage = 'Password and Confirm Password must be the same';
      alert(this.FMessage);
      return;
    } else {
      let Record: any = {};

      Record['first_name'] = this.first_name;
      Record['last_name'] = this.last_name;
      Record['email'] = this.email;
      Record['is_company'] = true;
      Record['company_name'] =
        this.first_name + ' ' + this.last_name + ' Company';
      Record['role'] = 'admin';
      Record['user_name'] = this.email;
      if (
        this.first_name === '' ||
        this.last_name === '' ||
        this.email === '' ||
        this.password === ''
      ) {
        alert('Please fill all information');
        return;
      } else {
        this.addUserRecord(Record, this.email, this.password)
          .then(() => {
            this.router.navigate(['/login']);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    this.loading = false;
  }
  navigateToSignin() {
    this.router.navigate(['/login']);
  }

  async addUserRecord(record: any, email: string, pass: string) {
    try {
      const user = await this.afu.createUserWithEmailAndPassword(email, pass);

      const id = user.user?.uid.toString();
      record['id'] = id;
      return await this.fireStore
        .collection('Users')
        .doc(user.user?.uid.toString())
        .set(record);
    } catch (error) {
      let errorStringify = JSON.parse(JSON.stringify(error));
      alert(errorStringify.code);
      throw error;
    }
  }

  ngOnInit(): void {}
}
