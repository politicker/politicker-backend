import { GraphQLResolveInfo } from 'graphql';
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
};

export type Bill = {
  __typename?: 'Bill';
  active: Scalars['Boolean'];
  categories: Array<Category>;
  committeeCodes: Array<Maybe<Scalars['String']>>;
  committees: Scalars['String'];
  congressdotgovURL: Scalars['String'];
  cosponsors: Scalars['Int'];
  enacted: Scalars['String'];
  govtrackURL: Scalars['String'];
  gpoPdfURI: Scalars['String'];
  housePassage: Scalars['String'];
  id: Scalars['ID'];
  introducedDate: Scalars['String'];
  latestMajorAction: Scalars['String'];
  latestMajorActionDate: Scalars['String'];
  likeCount: Scalars['Int'];
  liked: Scalars['Boolean'];
  likes: Array<Like>;
  number: Scalars['String'];
  primarySubject: Scalars['String'];
  senatePassage: Scalars['String'];
  shortTitle: Scalars['String'];
  sponsorID: Scalars['String'];
  sponsorName: Scalars['String'];
  sponsorParty: Scalars['String'];
  sponsorState: Scalars['String'];
  sponsorTitle: Scalars['String'];
  sponsorURI: Scalars['String'];
  statuses: Array<Status>;
  subcommitteeCodes: Array<Maybe<Scalars['String']>>;
  summary: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateLikeInput = {
  billID: Scalars['ID'];
};

export type CreateLikeResponse = {
  __typename?: 'CreateLikeResponse';
  bill: Bill;
};

export type Like = {
  __typename?: 'Like';
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLike: CreateLikeResponse;
};


export type MutationCreateLikeArgs = {
  input: CreateLikeInput;
};

export type Query = {
  __typename?: 'Query';
  bills: Array<Bill>;
};

export type Status = {
  __typename?: 'Status';
  actionDate: Scalars['String'];
  actionName: Scalars['String'];
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
  Bill: ResolverTypeWrapper<Bill>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<Category>;
  CreateLikeInput: CreateLikeInput;
  CreateLikeResponse: ResolverTypeWrapper<CreateLikeResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Like: ResolverTypeWrapper<Like>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Status: ResolverTypeWrapper<Status>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Bill: Bill;
  Boolean: Scalars['Boolean'];
  Category: Category;
  CreateLikeInput: CreateLikeInput;
  CreateLikeResponse: CreateLikeResponse;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Like: Like;
  Mutation: {};
  Query: {};
  Status: Status;
  String: Scalars['String'];
};

export type BillResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bill'] = ResolversParentTypes['Bill']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  committeeCodes?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  committees?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  congressdotgovURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cosponsors?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  enacted?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  govtrackURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gpoPdfURI?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  housePassage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  introducedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latestMajorAction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latestMajorActionDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  liked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likes?: Resolver<Array<ResolversTypes['Like']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  primarySubject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  senatePassage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shortTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sponsorID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sponsorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sponsorParty?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sponsorState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sponsorTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sponsorURI?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  statuses?: Resolver<Array<ResolversTypes['Status']>, ParentType, ContextType>;
  subcommitteeCodes?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLikeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateLikeResponse'] = ResolversParentTypes['CreateLikeResponse']> = {
  bill?: Resolver<ResolversTypes['Bill'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createLike?: Resolver<ResolversTypes['CreateLikeResponse'], ParentType, ContextType, RequireFields<MutationCreateLikeArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  bills?: Resolver<Array<ResolversTypes['Bill']>, ParentType, ContextType>;
};

export type StatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = {
  actionDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  actionName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Bill?: BillResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CreateLikeResponse?: CreateLikeResponseResolvers<ContextType>;
  Like?: LikeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
};

