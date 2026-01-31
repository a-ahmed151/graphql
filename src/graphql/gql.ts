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
    "query UserIDs {\n  user {\n    firstName\n    lastName\n    login\n    id\n    labels{\n      eventId\n    }\n  }\n}": typeof types.UserIDsDocument,
    "query UserInfo($userId: Int!) {\n  user: user_by_pk(id: $userId) {\n    id\n    login\n    attrs\n    email\n    campus\n    profile\n    lastName\n    firstName\n    avatarUrl\n    auditRatio\n    totalUp\n    totalUpBonus\n    totalDown\n    roles {\n      slug\n    }\n    labels {\n      labelName\n      labelId\n      eventId\n    }\n    records {\n      startAt\n      endAt\n      message\n      createdAt\n      type {\n        canAccessPlatform\n        isPermanent\n        canBeAuditor\n        label\n        type\n      }\n    }\n    transactions(\n      order_by: [{type: desc}, {amount: desc}]\n      distinct_on: [type]\n      where: {userId: {_eq: $userId}, type: {_like: \"skill_%\"}}\n    ) {\n      type\n      amount\n    }\n  }\n}": typeof types.UserInfoDocument,
    "query UserXpAndLevel($userId: Int!, $rootEventId: Int!) {\n  xp: transaction_aggregate(\n    where: {userId: {_eq: $userId}, type: {_eq: \"xp\"}, eventId: {_eq: $rootEventId}}\n  ) {\n    aggregate {\n      sum {\n        amount\n      }\n    }\n  }\n  level: transaction(\n    limit: 1\n    order_by: {amount: desc}\n    where: {userId: {_eq: $userId}, type: {_eq: \"level\"}, eventId: {_eq: $rootEventId}}\n  ) {\n    amount\n  }\n}": typeof types.UserXpAndLevelDocument,
    "query ProjectXpTransactions($userId: Int!, $eventId: Int!) {\n  transaction(\n    where: { userId: { _eq: $userId }, type: { _eq: \"xp\" }, eventId: { _eq: $eventId } }\n    order_by: { createdAt: desc }   # newest first\n    limit: 5\n  ) {\n    id\n    amount\n    eventId\n    path\n    createdAt\n  }\n}\n": typeof types.ProjectXpTransactionsDocument,
    "query PendingAudits($userId: Int!, $campus: String!) {\n  audit(\n    where: {\n      group: { campus: { _eq: $campus } }\n      grade: { _is_null: true },\n      resultId: { _is_null: true },\n      auditorId: { _eq: $userId },\n      private: {code: {_is_null: false}}\n    }\n    order_by: {endAt: asc_nulls_last, createdAt: asc}\n  ) {\n    id\n    group {\n      id\n      path\n      captainLogin\n      captain {\n        canAccessPlatform\n      }\n      members_aggregate {\n        aggregate {\n          count\n        }\n      }\n      event {\n        id\n      }\n    }\n    private {\n      code\n    }\n    createdAt\n    endAt\n    version\n    grade\n    closureType\n  }\n}\n": typeof types.PendingAuditsDocument,
};
const documents: Documents = {
    "query UserIDs {\n  user {\n    firstName\n    lastName\n    login\n    id\n    labels{\n      eventId\n    }\n  }\n}": types.UserIDsDocument,
    "query UserInfo($userId: Int!) {\n  user: user_by_pk(id: $userId) {\n    id\n    login\n    attrs\n    email\n    campus\n    profile\n    lastName\n    firstName\n    avatarUrl\n    auditRatio\n    totalUp\n    totalUpBonus\n    totalDown\n    roles {\n      slug\n    }\n    labels {\n      labelName\n      labelId\n      eventId\n    }\n    records {\n      startAt\n      endAt\n      message\n      createdAt\n      type {\n        canAccessPlatform\n        isPermanent\n        canBeAuditor\n        label\n        type\n      }\n    }\n    transactions(\n      order_by: [{type: desc}, {amount: desc}]\n      distinct_on: [type]\n      where: {userId: {_eq: $userId}, type: {_like: \"skill_%\"}}\n    ) {\n      type\n      amount\n    }\n  }\n}": types.UserInfoDocument,
    "query UserXpAndLevel($userId: Int!, $rootEventId: Int!) {\n  xp: transaction_aggregate(\n    where: {userId: {_eq: $userId}, type: {_eq: \"xp\"}, eventId: {_eq: $rootEventId}}\n  ) {\n    aggregate {\n      sum {\n        amount\n      }\n    }\n  }\n  level: transaction(\n    limit: 1\n    order_by: {amount: desc}\n    where: {userId: {_eq: $userId}, type: {_eq: \"level\"}, eventId: {_eq: $rootEventId}}\n  ) {\n    amount\n  }\n}": types.UserXpAndLevelDocument,
    "query ProjectXpTransactions($userId: Int!, $eventId: Int!) {\n  transaction(\n    where: { userId: { _eq: $userId }, type: { _eq: \"xp\" }, eventId: { _eq: $eventId } }\n    order_by: { createdAt: desc }   # newest first\n    limit: 5\n  ) {\n    id\n    amount\n    eventId\n    path\n    createdAt\n  }\n}\n": types.ProjectXpTransactionsDocument,
    "query PendingAudits($userId: Int!, $campus: String!) {\n  audit(\n    where: {\n      group: { campus: { _eq: $campus } }\n      grade: { _is_null: true },\n      resultId: { _is_null: true },\n      auditorId: { _eq: $userId },\n      private: {code: {_is_null: false}}\n    }\n    order_by: {endAt: asc_nulls_last, createdAt: asc}\n  ) {\n    id\n    group {\n      id\n      path\n      captainLogin\n      captain {\n        canAccessPlatform\n      }\n      members_aggregate {\n        aggregate {\n          count\n        }\n      }\n      event {\n        id\n      }\n    }\n    private {\n      code\n    }\n    createdAt\n    endAt\n    version\n    grade\n    closureType\n  }\n}\n": types.PendingAuditsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query UserIDs {\n  user {\n    firstName\n    lastName\n    login\n    id\n    labels{\n      eventId\n    }\n  }\n}"): typeof import('./graphql').UserIDsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query UserInfo($userId: Int!) {\n  user: user_by_pk(id: $userId) {\n    id\n    login\n    attrs\n    email\n    campus\n    profile\n    lastName\n    firstName\n    avatarUrl\n    auditRatio\n    totalUp\n    totalUpBonus\n    totalDown\n    roles {\n      slug\n    }\n    labels {\n      labelName\n      labelId\n      eventId\n    }\n    records {\n      startAt\n      endAt\n      message\n      createdAt\n      type {\n        canAccessPlatform\n        isPermanent\n        canBeAuditor\n        label\n        type\n      }\n    }\n    transactions(\n      order_by: [{type: desc}, {amount: desc}]\n      distinct_on: [type]\n      where: {userId: {_eq: $userId}, type: {_like: \"skill_%\"}}\n    ) {\n      type\n      amount\n    }\n  }\n}"): typeof import('./graphql').UserInfoDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query UserXpAndLevel($userId: Int!, $rootEventId: Int!) {\n  xp: transaction_aggregate(\n    where: {userId: {_eq: $userId}, type: {_eq: \"xp\"}, eventId: {_eq: $rootEventId}}\n  ) {\n    aggregate {\n      sum {\n        amount\n      }\n    }\n  }\n  level: transaction(\n    limit: 1\n    order_by: {amount: desc}\n    where: {userId: {_eq: $userId}, type: {_eq: \"level\"}, eventId: {_eq: $rootEventId}}\n  ) {\n    amount\n  }\n}"): typeof import('./graphql').UserXpAndLevelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProjectXpTransactions($userId: Int!, $eventId: Int!) {\n  transaction(\n    where: { userId: { _eq: $userId }, type: { _eq: \"xp\" }, eventId: { _eq: $eventId } }\n    order_by: { createdAt: desc }   # newest first\n    limit: 5\n  ) {\n    id\n    amount\n    eventId\n    path\n    createdAt\n  }\n}\n"): typeof import('./graphql').ProjectXpTransactionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PendingAudits($userId: Int!, $campus: String!) {\n  audit(\n    where: {\n      group: { campus: { _eq: $campus } }\n      grade: { _is_null: true },\n      resultId: { _is_null: true },\n      auditorId: { _eq: $userId },\n      private: {code: {_is_null: false}}\n    }\n    order_by: {endAt: asc_nulls_last, createdAt: asc}\n  ) {\n    id\n    group {\n      id\n      path\n      captainLogin\n      captain {\n        canAccessPlatform\n      }\n      members_aggregate {\n        aggregate {\n          count\n        }\n      }\n      event {\n        id\n      }\n    }\n    private {\n      code\n    }\n    createdAt\n    endAt\n    version\n    grade\n    closureType\n  }\n}\n"): typeof import('./graphql').PendingAuditsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
