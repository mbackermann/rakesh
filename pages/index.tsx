import Image from 'next/image'
import { Inter } from '@next/font/google'
import OAuthClient from '../services/auth'
import Head from 'next/head'

// This gets called on every request
export async function getServerSideProps({ query }) {
  try {
    const { char } = query
    let charName = char?.toLowerCase() || 'rakesh'
    const oauthClient = new OAuthClient()
    const accessToken = await oauthClient.getToken()

    const imageObj = await fetch(
      `https://us.api.blizzard.com/profile/wow/character/azralon/${charName}/character-media?namespace=profile-us&locale=en_US&access_token=${accessToken}`
    ).then((data) => data.json())

    const charImageUrl = imageObj.assets.find(
      (asset) => asset.key == 'main'
    )?.value

    const charData = await fetch(
      `https://us.api.blizzard.com/profile/wow/character/azralon/${charName}?namespace=profile-us&locale=en_US&access_token=${accessToken}`
    ).then((data) => data.json())

    const data = {
      name: charData.name,
      charName: charName,
      imageUrl: charImageUrl,
      race: charData.race.name,
      charClass: charData.character_class.name,
      gender: charData.gender.name,
      faction: charData.faction.name,
    }
    // Pass data to the page via props
    return { props: { data } }
  } catch (err) {
    return { props: { data: { error: 'Erro' } } }
  }
}

export default function Home({ data }) {
  if (data.error) {
    return (
      <>
        <h1>Erro na busca</h1>
      </>
    )
  }
  return (
    <div
      className="rakesh"
      style={{
        backgroundColor: data.faction == 'Horde' ? '#310a0a' : '#0f0a31',
      }}
    >
      <Head>
        <title>{data.name} - Azralon</title>
      </Head>
      <h3>
        Quem é <span className="charName">{data.charName}</span> no Azralon?
      </h3>
      <p>
        Se você também nunca sabe qual é o char {data.name} nesse exato momento,
        esse site é pra você!
      </p>
      <h4 className="charClass">
        <Image
          src={`/icons/${data.charClass
            .toLowerCase()
            .split(' ')
            .join('_')}.png`}
          width="32"
          height="32"
        />
        {data.charClass}
      </h4>
      <h4 className="charClass">
        <Image
          src={`/icons/${data.faction.toLowerCase()}.png`}
          width="32"
          height="32"
        />
        {data.race}
      </h4>
      <h5>{data.gender}</h5>

      <img className="charImg" src={data.imageUrl} />
    </div>
  )
}
