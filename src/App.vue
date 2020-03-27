<template>
    <v-app id="inspire">
        <v-navigation-drawer fixed v-model="drawer" app>
            <v-list dense>
                <router-link v-bind:to="{ name: 'Home' }" class="side_bar_link">
                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>home</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>Home</v-list-item-content>
                    </v-list-item>
                </router-link>
                <router-link v-bind:to="{ name: 'Contact' }" class="side_bar_link">
                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>contact_mail</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>Contact</v-list-item-content>
                    </v-list-item>
                </router-link>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar color="indigo" dark fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-app-bar color="indigo" dark fixed app>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar>Home</v-toolbar>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn text v-bind:to="{ name: 'AddMovie' }">Add Movie</v-btn>
                    <v-btn id="user_email" text v-if="current_user">{{ current_user.email }}</v-btn>    
                    <v-btn text v-bind:to="{ name: 'Register' }" v-if="!current_user" id="register_btn">
                        Register
                    </v-btn>
                    <v-btn text v-bind:to="{ name: 'Login' }" v-if="!current_user" id="login_btn">Login</v-btn>
                    <v-btn id="logout_btn" text v-if="current_user" @click="logout">Logout</v-btn>
                </v-toolbar-items>
            </v-app-bar>
        </v-app-bar>
        <v-content>
            <v-container fluid>
                <div id="app">
                    <router-view/>
                </div>
            </v-container>
        </v-content>
        <v-footer color="indigo" app>
            <span class="white--text">&copy; 2020</span>
        </v-footer>
    </v-app>
</template>

<script>
import axios from 'axios'
import './assets/stylesheets/main.css'
import bus from './bus'

export default {
    data: () => ({
        drawer: null,
        current_user: null,
    }),
    props: {
        source: String,
    },
    mounted() {
        this.fetchUser();
        this.listenToEvents();
    },
    methods: {
        listenToEvents() {
            bus.$on('refreshUser', () => {
                this.fetchUser();
            });
        },
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
        logout() {
            return axios({
                    method: 'get',
                    url: 'http://localhost:8082/api/logout',
                })
                .then(() => {
                    bus.$emit('refreshUser');
                    this.$router.push({ name: 'Home' });
                })
                .catch(() => {});
        },
    },
};
</script>