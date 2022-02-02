const templateCode = document.getElementById('show-template').innerHTML

const renderTemplate = Handlebars.compile(templateCode)

const BASE_LINK = show => `http://api.tvmaze.com/singlesearch/shows?embed=seasons&q=${show}`

let doFetch = url => {
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('oops')
        })
}

let getShow = name => doFetch(BASE_LINK(name))

let renderShow = show => {
    document.getElementById('show-container').innerHTML = renderTemplate(
        {
            ...show,
            image: show.image?.original ?? show.image.medium,
            rating: show.rating.average,
            /* seasons: show._embedded.seasons.map(season => ({ ...season, image: season.image?.medium, episodes: season.episodeOrder })) */
        }
    )
}

 document.forms['show-form'].addEventListener('submit', event => {
    event.preventDefault()

 /*    let season = document.getElementById('seasons-container')
    if (season) {
        season.innerHTML = ''
    }   */

    getShow(document.forms['show-form'].elements.query.value)
        .then(data => {
            renderShow(data)
            document.forms['show-form'].elements.query.value = ''
            document.forms['show-form'].elements[1].disabled = false
        })
        .catch(error => {
            console.error(error)
            document.forms['show-form'].elements.query.value = ''
            document.forms['show-form'].elements[1].disabled = false
        })
})
