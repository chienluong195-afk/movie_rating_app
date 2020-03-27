<template>
  <v-container >
    <v-layout row wrap  v-if="current_user">
      <v-flex xs4 v-for="contact in contacts" :key="contact._id">
            <v-card>
                <v-card-title primary-title>
                    <div>
                        <div class="headline">
                            <v-btn text v-bind:to="`/contact/${contact._id}`">
                                {{ contact.name }}
                            </v-btn>
                        </div>
                        <span class="grey--text">{{ contact.email }}</span>
                    </div>
                </v-card-title>
                <v-card-text>
                    {{ contact.comment }}
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
    <v-form v-if="!current_user" v-model="valid" ref="form" lazy-validation>
    
        <v-text-field v-model="name" :rules="nameRules" :counter="10" label="Name" required></v-text-field>
    
        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required ></v-text-field>
    
        <v-textarea clearable clear-icon="cancel" v-model="comment" label="Comment" value=""></v-textarea>
    
        <v-btn class="mr-4" @click="submit">submit</v-btn>
    
        <v-btn @click="clear">clear</v-btn>
    
    </v-form>
  </v-container> 
</template>

<script>
import axios from 'axios'

export default {
    data: () => ({
        current_user: null,
        valid: true,
        name: '',
        email: '',
        comment: '',
        nameRules: [
            v => !!v || 'Name is required',
        ],
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid',
        ],
        contacts: [],
    }),
     mounted() {
        this.fetchContact();
        this.fetchUser();
        
    },
    methods: {
        async fetchUser() {
            return axios({
                    method: 'get',
                    url: 'http://localhost:8082/api/current_user',
                })
                .then((response) => {
                    this.current_user = response.data.current_user;
                })
                .catch(() => {});
        },
        async fetchContact() {
            return axios({
                    method: 'get',
                    url: 'http://localhost:8082/contacts',
                })
                .then((response) => {
                    this.contacts = response.data.contacts;
                })
                .catch(() => {});
        },
        submit() {
                if (this.$refs.form.validate()) {
                    return axios({
                            method: 'post',
                            data: {
                                name: this.name,
                                email: this.email,
                                comment: this.comment,
                            },
                            url: 'http://localhost:8082/contacts',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(() => {
                            this.$swal(
                                'Great!',
                                'Submited!',
                                'success',
                            );
                            this.$router.push({ name: 'Home' });
                            this.$refs.form.reset();
                        })
                        .catch(() => {
                            this.$swal(
                                'Oh oo!',
                                'Could not submit the contact!',
                                'error',
                            );
                        });
                }
                return true;
            },
            clear() {
                this.$refs.form.reset();
            },
    }
}
</script>