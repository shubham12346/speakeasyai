import getDbConnection from "./db";

export async function handleCheckoutSessionCompleted({ session, rajorPay }) {
  const customerId = session.customer as string;
  const customer = await rajorPay.customers.reterive(customerId);

  if ("email" in customer) {
    const sql = await getDbConnection();
    await createOrUpdateUser(sql, customer, customerId);
    // update user subscriptions
    await updateUserSubscription(sql);
    //insert the payment
  }
}

async function createOrUpdateUser(
  sql: any,
  customer: rajorpay.customer,
  customerId: String
) {
  try {
    const user = await sql`SELECT * FROM users WHERE email =${customer.email}`;
    if (user.length === 0) {
      await sql`INSERT INTO users (email,full_name,customer_id) VALUE (${customer.email}, ${customer.full_name},${customerId})`;
    }
  } catch (err) {
    console.log(`Error in inserting user`, err);
  }
}

async function updateUserSubscription(sql: any) {
  try {
    await sql`UPDATE INTO users (email,full_name,customer_id) VALUE (${customer.email}, ${customer.full_name},${customerId})`;
  } catch (err) {
    console.log(`Error in inserting user`, err);
  }
}
