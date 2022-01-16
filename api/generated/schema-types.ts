import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
declare namespace API {
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type Matter = {
  __typename?: 'Matter';
  agendaDate?: Maybe<Scalars['Date']>;
  billWould?: Maybe<Scalars['String']>;
  committeeName: Scalars['String'];
  enactedAt?: Maybe<Scalars['Date']>;
  enactmentNumber?: Maybe<Scalars['String']>;
  fileNumber?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  introducedAt?: Maybe<Scalars['Date']>;
  lastModifiedAt?: Maybe<Scalars['Date']>;
  longDescription?: Maybe<Scalars['String']>;
  nycLegislatureGuid: Scalars['String'];
  passedAt?: Maybe<Scalars['Date']>;
  postDate: Scalars['Date'];
  shortDescription?: Maybe<Scalars['String']>;
  status: MatterStatus;
  typeName: Scalars['String'];
  updatedAt?: Maybe<Scalars['Date']>;
};

export enum MatterStatus {
  Adopted = 'ADOPTED',
  Approved = 'APPROVED',
  Committee = 'COMMITTEE',
  Disapproved = 'DISAPPROVED',
  Enacted = 'ENACTED',
  Failed = 'FAILED',
  Filed = 'FILED',
  General = 'GENERAL',
  Hearing = 'HEARING',
  Local = 'LOCAL',
  Received = 'RECEIVED',
  Special = 'SPECIAL',
  Withdrawn = 'WITHDRAWN'
}

export type Query = {
  __typename?: 'Query';
  matter: Matter;
  matters: Array<Matter>;
};


export type QueryMatterArgs = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Matter: ResolverTypeWrapper<Matter>;
  MatterStatus: MatterStatus;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  Matter: Matter;
  Query: {};
  String: Scalars['String'];
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MatterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Matter'] = ResolversParentTypes['Matter']> = {
  agendaDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  billWould?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  committeeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enactedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  enactmentNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  introducedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  lastModifiedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  longDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nycLegislatureGuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  passedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  postDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  shortDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MatterStatus'], ParentType, ContextType>;
  typeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  matter?: Resolver<ResolversTypes['Matter'], ParentType, ContextType, RequireFields<QueryMatterArgs, 'id'>>;
  matters?: Resolver<Array<ResolversTypes['Matter']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Matter?: MatterResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


}
export default API