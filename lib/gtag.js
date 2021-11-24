// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: url,
    })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
    })
}

// https://developers.google.com/gtagjs/reference/event#search
export const search = (value) => {
    window.gtag('event', 'search', {
        search_term: value,
    })
}
