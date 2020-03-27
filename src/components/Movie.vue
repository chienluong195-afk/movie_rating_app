<template>
    <v-layout row wrap>
        <v-flex xs4>
            <v-card>
                <v-card-title primary-title>
                    <div>
                        <div class="headline">{{ movie.name }}</div>
                        <span class="grey--text">{{ movie.release_year }} ‧ {{ movie.genre }}</span>
                    </div>
                </v-card-title>
                <h6 class="card-title" @click="rate">Rate this movie</h6>
                <v-card-text>
                    {{ movie.description }}
                </v-card-text>
                 <v-btn v-if="current_user" @click="deleteContact(movie._id)"> Delete </v-btn>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import StarRating from 'vue-star-rating'

const wrapper = document.createElement('div')
// shared state
const state = {
    note: 0,
}
// crate component to content
const RatingComponent = Vue.extend({
    data() {
        return { rating: 0 };
    },
    watch: {
        rating(newVal) { state.note = newVal; },
    },
    template: `
    <div class="rating">
      How was your experience getting help with this issues?
      <star-rating v-model="rating" :show-rating="false"></star-rating>
    </div>`,
    components: { 'star-rating': StarRating },
})

const component = new RatingComponent().$mount(wrapper)

export default {
    name: 'Movie',
    data() {
        return {
            movie: [],
        };
    },
    mounted() {
        this.fetchUser();
        this.fetchMovie();
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
        async rate() {
            this.$swal({
                content: component.$el,
                buttons: {
                    confirm: {
                        value: 0,
                    },
                },
            }).then(() => {
                const movieId = this.$route.params.id;
                return axios({
                        method: 'post',
                        data: {
                            user_id: this.current_user._id,
                            rate: state.note,
                        },
                        url: `http://localhost:8082/movies/rate/${movieId}`,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(() => {
                        this.$swal(`Thank you for rating! ${state.note}`, 'success');
                    })
                    .catch((error) => {
                        const message = error.response.data.message;
                        this.$swal('Oh oo!', `${message}`, 'error');
                    });
            });
        },
        async fetchMovie() {
            return axios({
                    method: 'get',
                    url: `http://localhost:8082/api/movies/${this.$route.params.id}`,
                })
                .then((response) => {
                    this.movie = response.data;
                })
                .catch(() => {});
        },
        deleteContact(contactId) {
            return axios({
                method: 'delete',
                url: `http://localhost:8082/api/movie/delete/${contactId}`,
            })
            .then((response) => {
                this.$swal(
                    'Great!',
                    'The movie has been removed!',
                    'success',
                );
                this.$forceUpdate();
                this.$router.push({ name: 'Home' });
            })
            .catch(() => {
                this.$swal(
                    'Oh oo!',
                    'Could not remove the movie!',
                    'error',
                );
            });

        }
    },
}
</script>