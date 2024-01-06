exports.up = async function (knex) {
  /**
   * 1. Select id as kehu_id, situation from Kehus
   * 2. Insert {text: situation} to Situations, get situation_id
   * 3. Insert {kehu_id, situation_id} to Kehus_Situations
   */
  const kehus = await knex
    .select("id", "situation")
    .from("Kehus")
    .whereNotNull("situation");
  const promises = [];
  kehus.forEach(async (kehu) => {
    const situation = await knex("Situations")
      .returning("id")
      .insert({ text: kehu.situation });
    promises.push(
      await knex("Kehus_Situations").insert({
        kehu_id: kehu.id,
        situation_id: situation[0],
      }),
    );
  });

  return Promise.all(promises);
};

exports.down = async function (knex) {
  /**
   * 1. Select text from Situations, kehu_id from Kehus
   * 2. Insert {situation} to Kehus
   * 3. Remove Kehus_Situations, Remove Situations
   */

  const situations = await knex
    .select("Situations.text as situation", "Kehus.id as kehu_id")
    .from("Situations")
    .leftOuterJoin(
      "Kehus_Situations",
      "Situations.id",
      "Kehus_Situations.situation_id",
    )
    .leftOuterJoin("Kehus", "Kehus_Situations.kehu_id", "Kehus.id");

  const promises = [];
  situations.forEach(async (situation) => {
    promises.push(
      await knex("Kehus")
        .where("id", situation.kehu_id)
        .update({ situation: situation.situation }),
    );
  });
  promises.push(await knex("Kehus_Situations").del());
  promises.push(await knex("Situations").del());
  return Promise.all(promises);
};
