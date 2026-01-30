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

export const UserProjectProgressQuery = graphql(`query UserProjectProgress($userId: Int!, $eventId: Int!) {
  group(
    where: {members: {userId: {_eq: $userId}}, _or: [{eventId: {_eq: $eventId}}, {event: {parentId: {_eq: $eventId}}}]}
  ) {
    id
    path
    status
    captainLogin
    captainId
    members {
      id
      userId
      userLogin
      userAuditRatio
      accepted
      createdAt
      updatedAt
      answeredAt
      user {
        firstName
        lastName
        avatarUrl
      }
    }
    updatedAt
    canceledAt
    cancelReason
    startedWorkingAt
  }
}`)

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