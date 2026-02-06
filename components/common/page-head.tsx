import Head from 'next/head'

function PageHead({ title, og }) {
    return (
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content={title || `Fachschaft IWI`} />
            <meta property="og:site_name" content="Fachschaft IWI" />
            <meta property="og:description" content={og ? og.description : `Die Website der Fachschaft IWI, Hochschule Karlsruhe (HKA)`} />
            <meta name="twitter:site" content="@fsi_hska" />

            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/favicon.png" sizes="96x96" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

            <title>{`${Array.isArray(title) ? title.join(" ") : title} | Fachschaft IWI`}</title>
      </Head>
    )
}

export default PageHead