<template>
    <el-popover placement="bottom" title="Thông báo" width="200" trigger="click">
        <el-row>
            Sang Phạm đã bình luận ảnh của bạn !!
        </el-row>
        <el-badge :value="12" class="item" slot="reference">
            <i class="el-icon-bell"></i>
        </el-badge>
    </el-popover>
</template>