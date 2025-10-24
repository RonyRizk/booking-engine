export default function robots() {
    return {
        rules: [{
            userAgent: '*',
            allow: '/',
            // disallow: '/private/',
        },
            // {
            // userAgent: ['Googlebot', 'AdsBot-Google-Mobile', 'AdsBot-Google', 'Google-Site-Verification'],
            // allow: ['/'],
            // },
        ]

    }
}
