export const makeReject = (status, message) => Promise.reject({status, message})

export const isObject = x => x && typeof x === 'object'

export const buildSearchParams = (params) => Object.keys(params).map(key => {
    if (Array.isArray(params[key])) {
        return params[key].map(v => (encodeURIComponent(key) + '[]=' + encodeURIComponent(v))).join('&')
    }
    return [key, params[key]].map(encodeURIComponent).join('=')
}).join('&').replace(/%20/g, '+')

const defaultHeaders = {
    'Accept': 'application/json'
}

const defaultOptions = {
    credentials: 'include',
    mode: 'cors'
}

class Fetch {
    static getJSON(url, params = {}, options = {}) {
        if (!url.trim()) {
            return makeReject(-101, 'URL is empty')
        }

        if (!isObject(params) || !isObject(options)) {
            return makeReject(-102, 'The type of params and options must be a Object')
        }

        params = buildSearchParams(params)
        const {headers, ...rest} = options

        options = {
            method: 'GET',
            headers: {
                ...defaultHeaders,
                ...headers
            },
            ...defaultOptions,
            ...rest
        }

        if (params) {
            const quesMark = new RegExp('\\?').test(url) ? '&' : '?'
            url = `${url}${quesMark}${params}`
        }

        return new Promise((resolve, reject) => {
            fetch(url, options).then(res => {
                if (res.status != 200) {
                    reject(res);
                } else {
                    res.json().then(json => {
                        const {code, data} = json
                        if (1 * code === 200) {
                            resolve(data)
                        } else {
                            reject(json)
                        }
                    })['catch'](e => {
                        reject(e)
                    })
                }
            }).catch(e => {
                console.log('fetch postJson error ', e)
                reject(e)
            })
        })
    }

    static postJSON(url, params = {}, options = {}) {
        if (!url.trim()) {
            return makeReject(-101, 'URL is empty')
        }

        if (!isObject(params) || !isObject(options)) {
            return makeReject(-102, 'The type of params and options must be a Object')
        }

        let {headers, formDataType, ...rest} = options
        let body

        headers = {...defaultHeaders, ...headers}

        switch (formDataType) {
            case 'json':
                headers['Content-Type'] = 'application/json;charset=UTF-8'
                params = Object.assign({}, params)
                body = JSON.stringify(params)
                break
            case 'FormData':
                const data = new FormData()
                params = Object.assign({}, params)
                for (let p in params) {
                    data.append(p, params[p])
                }
                body = data
                break
            case 'file':
                body = params
                break
            case 'urlencode':
            default:
                params = Object.assign({}, params)
                headers['Content-Type'] = 'application/x-www-form-urlencoded'
                body = buildSearchParams(params)
        }

        options = {
            method: 'POST',
            headers,
            body,
            ...defaultOptions,
            ...rest
        }

        return new Promise((resolve, reject) => {
            console.log(options)
            let httpStatus = ''
            fetch(url, options).then(res => {
                if (res.status != 200) {
                    reject(res);
                } else {
                    res.json().then(json => {
                        const {code, data} = json
                        if (1 * code === 200) {
                            resolve(data)
                        } else {
                            reject(json)
                        }
                    })['catch'](e => {
                        reject(e)
                    })
                }
            }).catch(e => {
                console.log('fetch postJson error ', e)
                reject(e)
            })
        })
    }
}

export default Fetch