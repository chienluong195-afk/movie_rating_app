<template>
    <v-container>
        <v-layout v-if="!current_user">
            You don't have permission to access this resource.
        </v-layout>
        <v-layout v-else-if="!contact">
           Nothing
        </v-layout>
        <v-layout v-else row wrap>
           <v-flex xs12>
               <v-card>
                   <v-card-title>
                        {{ contact.name }}
                   </v-card-title>
                    <v-card-title>
                        {{ contact.email }}
                   </v-card-title>
                   <v-card-text>
                        {{ contact.comment }}
                   </v-card-text>
                   <v-btn id="del_btn" text @click="deleteContact">Delete</v-btn>
               </v-card>
           </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import axios from 'axios'

export default {
    data: () => ({
        current_user: null,
        contact: [],
    }),
    mounted() {
        this.fetchUser();
        this.fetchContact();
    },
    methods: {
       async fetchContact() {
            const contactId = this.$route.params.id;
            return axios({
                    method: 'get',
                    url: `http://localhost:8082/api/contacts/${contactId}`,
                })
                .then((response) => {
                    this.contact = response.data;
                })
                .catch(() => {
                    this.contact = null;
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
        deleteContact() {
            const contactId = this.$route.params.id;
            return axios({
                method: 'delete',
                url: `http://localhost:8082/api/contacts/delete/${contactId}`,
            })
            .then((response) => {
                this.$swal(
                    'Great!',
                    'Contact has been removed!',
                    'success',
                );
                this.$router.push({ name: 'Contact' });
            })
            .catch(() => {
                this.$swal(
                    'Oh oo!',
                    'Could not remove the contact!',
                    'error',
                );
            });

        }
    }

}
</script>