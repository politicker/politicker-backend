import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  Date: any;
};

export type CreateLikeInput = {
  MatterID: Scalars['ID'];
};

export type CreateLikeResponse = {
  __typename?: 'CreateLikeResponse';
  matter: Matter;
};

export type Like = {
  __typename?: 'Like';
  id: Scalars['ID'];
};

export type Matter = {
  __typename?: 'Matter';
  agendaDate: Scalars['Date'];
  billWould: Scalars['String'];
  committeeName: Scalars['String'];
  enactedAt: Scalars['Date'];
  enactmentNumber: Scalars['String'];
  fileNumber: Scalars['String'];
  id: Scalars['ID'];
  introducedAt: Scalars['Date'];
  lastModifiedAt: Scalars['Date'];
  likeCount: Scalars['Int'];
  liked: Scalars['Boolean'];
  likes: Array<Like>;
  longDescription: Scalars['String'];
  nycLegislatureGuid: Scalars['String'];
  passedAt: Scalars['Date'];
  shortDescription: Scalars['String'];
  status: MatterStatus;
  typeName: Scalars['String'];
  updatedAt: Scalars['Date'];
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

export type Mutation = {
  __typename?: 'Mutation';
  createLike: CreateLikeResponse;
};


export type MutationCreateLikeArgs = {
  input: CreateLikeInput;
};

export type Query = {
  __typename?: 'Query';
  matters: Array<Matter>;
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
  CreateLikeInput: CreateLikeInput;
  CreateLikeResponse: ResolverTypeWrapper<CreateLikeResponse>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Like: ResolverTypeWrapper<Like>;
  Matter: ResolverTypeWrapper<Matter>;
  MatterStatus: MatterStatus;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateLikeInput: CreateLikeInput;
  CreateLikeResponse: CreateLikeResponse;
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Like: Like;
  Matter: Matter;
  Mutation: {};
  Query: {};
  String: Scalars['String'];
};

export type CreateLikeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateLikeResponse'] = ResolversParentTypes['CreateLikeResponse']> = {
  matter?: Resolver<ResolversTypes['Matter'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type LikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Matter'] = ResolversParentTypes['Matter']> = {
  agendaDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  billWould?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  committeeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enactedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  enactmentNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  introducedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  lastModifiedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  liked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likes?: Resolver<Array<ResolversTypes['Like']>, ParentType, ContextType>;
  longDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nycLegislatureGuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  passedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MatterStatus'], ParentType, ContextType>;
  typeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createLike?: Resolver<ResolversTypes['CreateLikeResponse'], ParentType, ContextType, RequireFields<MutationCreateLikeArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  matters?: Resolver<Array<ResolversTypes['Matter']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CreateLikeResponse?: CreateLikeResponseResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Like?: LikeResolvers<ContextType>;
  Matter?: MatterResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

