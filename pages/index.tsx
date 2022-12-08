import type { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import Player from '../components/Player';
import { getSession } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>DeliveryPortal</title>
        {/* <link rel="icon" type="image/png" href="https://cortexwork.com/deliveryportal/public/websetting/favicon-01_1663058042.png" /> */}
      </Head>
      <main className="flex">
        <Sidebar />
        <Content />
      </main>

      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

export default Home;

// export async function getServerSideProps(context) {
//   const providers = await getSession(context)
//   return {
//     props: { providers },
//   }
// }
