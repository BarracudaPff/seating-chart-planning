const {API_ENDPOINT, DEVELOPMENT} = {API_ENDPOINT: "", DEVELOPMENT: "true"}

const PROD = DEVELOPMENT === "false"
const isDevelopment = !PROD

export default {
    isProduction: PROD,
    isDevelopment,
    showFPS: true,

    baseURL: "/",
    //TODO: add here
    domainURL: isDevelopment ? "http://localhost:8080/" : null,

    title: "Seating Chart Planning",
    http: {
        apiURL: API_ENDPOINT as string
    },
}
