import getDbConnection from "@/lib/db";

const Home = async () => {
  const sql = await getDbConnection();

  const response = await sql`SELECT version()`;
  return <section>{response[0].version}</section>;
};

export default Home;
