import { graphql } from "../../graphql";

export const GRAPHQL_API =
  "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export const USER_PROFILE_QUERY = graphql(`
  query USERINFO {
    user {
      id
      login
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
        order_by: [{ type: desc }, { amount: desc }]
        distinct_on: [type]
      ) {
        type
        amount
      }
    }
  }
`);
