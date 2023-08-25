import createAccessToken from './auth';
import Image from 'next/image';
import Table from './components/Table';
import Link from 'next/link';

interface Entry {
  rating: number;
  character: {
    name: string;
    realm: {
      slug: string;
    };
  };
  faction: {
    type: string;
  };
  season_match_statistics: {
    won: number;
    lost: number;
  };
}

interface TableRow {
  rating: number;
  player: string;
  faction: string;
  realm: string;
  wins: number;
  losses: number;
}

async function getLadderData(): Promise<TableRow[]> {
  const auth = await createAccessToken();
  const response = await fetch('https://us.api.blizzard.com/data/wow/pvp-season/35/pvp-leaderboard/3v3?namespace=dynamic-us&locale=en_US&access_token=' + auth.access_token, {
    cache: 'no-store'
  });
  const data = await response.json();
  const filteredData = data.entries.slice(0, 50);
  const mappedData = filteredData.map((entry: Entry) => ({
    rating: entry.rating,
    player: entry.character.name,
    faction: entry.faction.type,
    realm: entry.character.realm.slug,
    wins: entry.season_match_statistics.won,
    losses: entry.season_match_statistics.lost
  }));
  return mappedData;
}

export default async function Home() {
  const data = await getLadderData();
  return (
    <div className="flex min-h-screen flex-col items-center py-24 overflow-hidden bg-gradient-to-tl from-black via-zinc-800 to-black">
      <span className='text-zinc-200 mb-8'>World of warcraft arena ladder created with <Link href='https://nextjs.org/' className='text-zinc-100 underline'> Next.js </Link>
        and <Link href='https://develop.battle.net/' className='text-zinc-100 underline'>Blizzard&apos;s API</Link>.
      </span>
      <div className="max-w-screen-md mx-auto">
        <Table data={data} />
      </div>
    </div>
  );
}
