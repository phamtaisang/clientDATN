export default {
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: 'sangpt',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
        script: [
            { src: '/socket.io/socket.io.js' },
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '@/assets/style.css',
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '@/plugins/element-ui',
        '~/plugins/firebase',
        '@/plugins/axios',
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        'nuxt-socket-io',
        '@nuxtjs/axios',
        '@nuxtjs/auth', ['nuxt-gmaps', {
            key: 'AIzaSyDlkPRpU8Qk221zsdBOpn8cVl_WDSBtIWk',
            libraries: ['places']
        }]
    ],

    axios: {
        // proxy: true,
        baseURL: 'https://sangpt97.herokuapp.com'
    },
    auth: {
        strategies: {
            local: {
                scheme: 'refresh',
                token: {
                    property: 'access_token',
                    maxAge: 60, // Just set this at 1 minute to try the auto refresh
                    type: 'Bearer',
                },
                refreshToken: {
                    property: 'refresh_token',
                    maxAge: 60 * 60 * 24 * 30, // same as refresh_ttl but in seconds
                },
                user: {
                    property: '',
                    autoFetch: true,
                },
                endpoints: {
                    login: {
                        url: '/api/auth/login',
                        method: 'post',
                        propertyName: "token"
                    },
                    user: { url: '/api/auth/me', method: 'get', propertyName: "data" },
                    logout: { url: '/api/auth', method: 'post' },
                    refresh: {
                        url: '/api/auth/refresh',
                        method: 'post',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Content-Type': 'application/json',
                        },
                        data: { //Failed attempt to add the additional params here
                            grant_type: 'refresh_token',
                            client_id: '2',
                            client_secret: 'EKZWv2BF9A3I2VXZZ1x0LMu50nHxkcseCvk7BT8U',
                            scope: '',
                        },
                    },
                },
                tokenRequired: true,
                tokenType: 'Bearer'
            }
        }
    },

    router: {
        // middleware: ['authenticated']
    },

    io: {
        // module options
        sockets: [{
            name: 'main',
            url: 'http://0.0.0.0:4000'
        }]
    },
    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        transpile: [/^element-ui/, '@nuxtjs/auth'],
    }
}
