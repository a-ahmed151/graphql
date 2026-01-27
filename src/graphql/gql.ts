/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query USERINFO {\n    user {\n      id\n      login\n      email\n      campus\n      profile\n      lastName\n      firstName\n      avatarUrl\n      auditRatio\n      totalUp\n      totalUpBonus\n      totalDown\n      roles {\n        slug\n      }\n      labels {\n        labelName\n        labelId\n        eventId\n      }\n      records {\n        startAt\n        endAt\n        message\n        createdAt\n        type {\n          canAccessPlatform\n          isPermanent\n          canBeAuditor\n          label\n          type\n        }\n      }\n      transactions(\n        order_by: [{ type: desc }, { amount: desc }]\n        distinct_on: [type]\n      ) {\n        type\n        amount\n      }\n    }\n  }\n": typeof types.UserinfoDocument,
};
const documents: Documents = {
    "\n  query USERINFO {\n    user {\n      id\n      login\n      email\n      campus\n      profile\n      lastName\n      firstName\n      avatarUrl\n      auditRatio\n      totalUp\n      totalUpBonus\n      totalDown\n      roles {\n        slug\n      }\n      labels {\n        labelName\n        labelId\n        eventId\n      }\n      records {\n        startAt\n        endAt\n        message\n        createdAt\n        type {\n          canAccessPlatform\n          isPermanent\n          canBeAuditor\n          label\n          type\n        }\n      }\n      transactions(\n        order_by: [{ type: desc }, { amount: desc }]\n        distinct_on: [type]\n      ) {\n        type\n        amount\n      }\n    }\n  }\n": types.UserinfoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query USERINFO {\n    user {\n      id\n      login\n      email\n      campus\n      profile\n      lastName\n      firstName\n      avatarUrl\n      auditRatio\n      totalUp\n      totalUpBonus\n      totalDown\n      roles {\n        slug\n      }\n      labels {\n        labelName\n        labelId\n        eventId\n      }\n      records {\n        startAt\n        endAt\n        message\n        createdAt\n        type {\n          canAccessPlatform\n          isPermanent\n          canBeAuditor\n          label\n          type\n        }\n      }\n      transactions(\n        order_by: [{ type: desc }, { amount: desc }]\n        distinct_on: [type]\n      ) {\n        type\n        amount\n      }\n    }\n  }\n"): typeof import('./graphql').UserinfoDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
