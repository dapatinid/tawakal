import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/cabang/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::create
* @see app/Http/Controllers/Admin/BranchAdminController.php:50
* @route '/admin/cabang/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::store
* @see app/Http/Controllers/Admin/BranchAdminController.php:58
* @route '/admin/cabang'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/cabang',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::store
* @see app/Http/Controllers/Admin/BranchAdminController.php:58
* @route '/admin/cabang'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::store
* @see app/Http/Controllers/Admin/BranchAdminController.php:58
* @route '/admin/cabang'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::store
* @see app/Http/Controllers/Admin/BranchAdminController.php:58
* @route '/admin/cabang'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::store
* @see app/Http/Controllers/Admin/BranchAdminController.php:58
* @route '/admin/cabang'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/cabang',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::index
* @see app/Http/Controllers/Admin/BranchAdminController.php:16
* @route '/admin/cabang'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
export const edit = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/cabang/{branch}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
edit.url = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { branch: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            branch: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return edit.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
edit.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
edit.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
const editForm = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
editForm.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::edit
* @see app/Http/Controllers/Admin/BranchAdminController.php:93
* @route '/admin/cabang/{branch}/edit'
*/
editForm.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::update
* @see app/Http/Controllers/Admin/BranchAdminController.php:113
* @route '/admin/cabang/{branch}'
*/
export const update = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/cabang/{branch}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::update
* @see app/Http/Controllers/Admin/BranchAdminController.php:113
* @route '/admin/cabang/{branch}'
*/
update.url = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { branch: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            branch: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return update.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::update
* @see app/Http/Controllers/Admin/BranchAdminController.php:113
* @route '/admin/cabang/{branch}'
*/
update.put = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::update
* @see app/Http/Controllers/Admin/BranchAdminController.php:113
* @route '/admin/cabang/{branch}'
*/
const updateForm = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::update
* @see app/Http/Controllers/Admin/BranchAdminController.php:113
* @route '/admin/cabang/{branch}'
*/
updateForm.put = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::destroy
* @see app/Http/Controllers/Admin/BranchAdminController.php:164
* @route '/admin/cabang/{branch}'
*/
export const destroy = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/cabang/{branch}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::destroy
* @see app/Http/Controllers/Admin/BranchAdminController.php:164
* @route '/admin/cabang/{branch}'
*/
destroy.url = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { branch: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            branch: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return destroy.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::destroy
* @see app/Http/Controllers/Admin/BranchAdminController.php:164
* @route '/admin/cabang/{branch}'
*/
destroy.delete = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::destroy
* @see app/Http/Controllers/Admin/BranchAdminController.php:164
* @route '/admin/cabang/{branch}'
*/
const destroyForm = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BranchAdminController::destroy
* @see app/Http/Controllers/Admin/BranchAdminController.php:164
* @route '/admin/cabang/{branch}'
*/
destroyForm.delete = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const cabang = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    index: Object.assign(index, index),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default cabang