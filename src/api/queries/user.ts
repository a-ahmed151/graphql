import { graphql } from "../../graphql";

export const GRAPHQL_API =
  "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export const UserIDs = graphql(`query UserIDs {
  user {
    firstName
    lastName
    login
    id
    labels{
      eventId
    }
  }
}`)

export const UserInfoQuery = graphql(`query UserInfo($userId: Int!) {
  user: user_by_pk(id: $userId) {
    id
    login
    attrs
    email
    campus
    profile
    lastName
    firstName
    avatarUrl
    auditRatio
    totalUp
    totalUpBonus
    totalDown
    roles {
      slug
    }
    labels {
      labelName
      labelId
      eventId
    }
    records {
      startAt
      endAt
      message
      createdAt
      type {
        canAccessPlatform
        isPermanent
        canBeAuditor
        label
        type
      }
    }
    transactions(
      order_by: [{type: desc}, {amount: desc}]
      distinct_on: [type]
      where: {userId: {_eq: $userId}, type: {_like: "skill_%"}}
    ) {
      type
      amount
    }
  }
}`);

export const UserXpAndLevelQuery = graphql(`query UserXpAndLevel($userId: Int!, $rootEventId: Int!) {
  xp: transaction_aggregate(
    where: {userId: {_eq: $userId}, type: {_eq: "xp"}, eventId: {_eq: $rootEventId}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
  level: transaction(
    limit: 1
    order_by: {amount: desc}
    where: {userId: {_eq: $userId}, type: {_eq: "level"}, eventId: {_eq: $rootEventId}}
  ) {
    amount
  }
}`)

export const UserProjectProgressQuery = graphql(`query ProjectXpTransactions($userId: Int!, $eventId: Int!) {
  transaction(
    where: { userId: { _eq: $userId }, type: { _eq: "xp" }, eventId: { _eq: $eventId } }
    order_by: { createdAt: desc }   # newest first
    limit: 5
  ) {
    id
    amount
    eventId
    path
    createdAt
  }
}
`)

export const PendingAuditsQuery = graphql(`query PendingAudits($userId: Int!, $campus: String!) {
  audit(
    where: {
      group: { campus: { _eq: $campus } }
      grade: { _is_null: true },
      resultId: { _is_null: true },
      auditorId: { _eq: $userId },
      private: {code: {_is_null: false}}
    }
    order_by: {endAt: asc_nulls_last, createdAt: asc}
  ) {
    id
    group {
      id
      path
      captainLogin
      captain {
        canAccessPlatform
      }
      members_aggregate {
        aggregate {
          count
        }
      }
      event {
        id
      }
    }
    private {
      code
    }
    createdAt
    endAt
    version
    grade
    closureType
  }
}
`)